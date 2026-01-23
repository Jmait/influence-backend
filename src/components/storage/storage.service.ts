import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sanitizeHtml from 'sanitize-html';
import sharp from 'sharp';

/**
 * Storage service configuration constants
 */
const STORAGE_CONFIG = {
  /**
   * Maximum file size in bytes (5MB)
   */
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  /**
   * Allowed MIME types for image uploads
   */
  ALLOWED_IMAGE_TYPES: {
    PNG: 'image/png',
    JPEG: 'image/jpeg',
    JPG: 'image/jpg',
    SVG: 'image/svg+xml',
    WEBP: 'image/webp',
    ICO: 'image/x-icon',
  } as const,
} as const;

/**
 * Derive array of allowed types for validation
 */
const ALLOWED_IMAGE_TYPES_ARRAY = Object.values(
  STORAGE_CONFIG.ALLOWED_IMAGE_TYPES,
) as string[];

/**
 * Human-readable type descriptions for error messages
 */
const ALLOWED_TYPES_DESCRIPTION = 'PNG, JPEG, JPG, SVG, WebP, ICO';

export interface UploadResult {
  file_url: string;
  file_key: string;
  file_size: number;
  mime_type: string;
}

export interface UploadOptions {
  userId: string;
  service: string;
  folder: string;
  file_name: string;
  content_type: string;
  isPublic?: boolean;
}

export interface FileKeyComponents {
  userId: string;
  service: string;
  folder: string;
  file_name: string;
  isPublic: boolean;
}

export const LOGGER_SERVICE = Symbol('LOGGER_SERVICE');
@Injectable()
export class StorageService {
  private readonly bucket: string;
  private readonly s3Client: S3Client;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(LOGGER_SERVICE) private readonly logger: Logger,
  ) {
    // Use exact bucket name from environment variable
    this.bucket =
      this.configService.get<string>('S3_BUCKET') || 'liga-dev-assets';

    this.accessKeyId = this.configService.get('S3_ACCESS_KEY_ID') || '';
    this.secretAccessKey = this.configService.get('S3_SECRET_ACCESS_KEY') || '';

    this.logger.log('StorageService initialized', {
      bucket: this.bucket,
    });

    // Initialize S3 client
    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  /**
   * Generate S3 file key from path components
   *
   * Centralizes file path generation logic to ensure consistency
   * across all storage operations. Uses tenant isolation pattern with
   * visibility and service segmentation.
   *
   * Format: {visibility}/{userId}/{service}/{folder}/{file_name}
   * Example: private/tenant-123/vip/tiers/bronze/tier_image_1234567890.png
   *
   * @param params - File path components
   * @returns Complete S3 file key path
   */
  private generateFileKey(params: FileKeyComponents): string {
    const { userId, service, folder, file_name, isPublic } = params;
    const visibility = isPublic ? 'public' : 'private';
    return `${visibility}/${userId}/${service}/${folder}/${file_name}`;
  }

  /**
   * Upload file to S3 bucket
   *
   * Supports PNG, JPEG, JPG, SVG, WebP, and ICO files (up to 5MB) with automatic
   * optimization and sanitization. Files are stored in S3 with private access by
   * default unless isPublic is specified.
   */
  async uploadFile(
    buffer: Buffer,
    options: UploadOptions,
  ): Promise<UploadResult> {
    const {
      userId,
      service,
      folder,
      file_name,
      content_type,
      isPublic = false,
    } = options;

    try {
      // Generate S3 key with visibility, tenant isolation, and service segmentation
      const fileKey = this.generateFileKey({
        userId,
        service,
        folder,
        file_name,
        isPublic,
      });
      // Upload to S3 (ACL not used - bucket has "Bucket owner enforced" setting)
      // Access control is managed via bucket policy, not per-object ACLs
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: buffer,
        ContentType: content_type,
      });

      await this.s3Client.send(command);

      this.logger.log('File uploaded successfully', {
        userId,
        service,
        file_key: fileKey,
        file_size: buffer.length,
        content_type,
        is_public: isPublic,
      });

      return {
        file_url: this.buildFileUrl(fileKey),
        file_key: fileKey,
        file_size: buffer.length,
        mime_type: content_type,
      };
    } catch (error) {
      this.logger.error('Error uploading file', {
        userId,
        service,
        error: error.message,
      });
      throw error;
    }
  }

  async uploadPublicFiles(buffer: Buffer, options: UploadOptions) {
    return await this.uploadFile(buffer, { ...options, isPublic: true });
  }

  /**
   * Delete file from S3 bucket
   */
  async deleteFile(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      await this.s3Client.send(command);

      this.logger.log('File deleted successfully', { file_key: fileKey });
    } catch (error) {
      this.logger.error('Error deleting file', {
        file_key: fileKey,
        error: error.message,
      });
      // Don't throw - deletion failures shouldn't block operations
    }
  }

  /**
   * Build full S3 URL from file key
   * Centralizes URL construction logic for flexibility
   */
  buildFileUrl(fileKey: string): string {
    const region = this.configService.get<string>('S3_REGION') || 'us-east-1';
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${fileKey}`;
  }

  extractS3Key(url: string) {
    try {
      const parsed = new URL(url);

      return parsed.pathname.replace(/^\/+/, '');
    } catch (error) {
      console.log('Error extracting S3 key from URL:', error.message);
      return null;
    }
  }

  /**
   * Validate image file
   *
   * Validates uploaded files against allowed MIME types and size limits.
   * Supports PNG, JPEG, JPG, SVG, WebP, and ICO formats up to 5MB.
   */
  validateImageFile(file: Express.Multer.File): void {
    if (!ALLOWED_IMAGE_TYPES_ARRAY.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_TYPES_DESCRIPTION}`,
      );
    }

    if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum: ${file.size} bytes (max: ${STORAGE_CONFIG.MAX_FILE_SIZE} bytes)`,
      );
    }
  }

  getFileByField = (fieldName: string, files: Express.Multer.File[]) => {
    if (!Array.isArray(files)) return undefined;
    return files.find((f) => f.fieldname === fieldName);
  };

  /**
   * Sanitize SVG content to prevent XSS attacks
   */
  sanitizeSvg(svgContent: string): string {
    return sanitizeHtml(svgContent, {
      allowedTags: [
        'svg',
        'path',
        'circle',
        'rect',
        'line',
        'polyline',
        'polygon',
        'ellipse',
        'text',
        'tspan',
        'g',
        'defs',
        'clipPath',
        'mask',
        'linearGradient',
        'radialGradient',
        'stop',
        'use',
      ],
      allowedAttributes: {
        '*': [
          'id',
          'class',
          'fill',
          'stroke',
          'stroke-width',
          'transform',
          'd',
          'cx',
          'cy',
          'r',
          'rx',
          'ry',
          'x',
          'y',
          'x1',
          'y1',
          'x2',
          'y2',
          'width',
          'height',
          'viewBox',
          'xmlns',
          'points',
          'offset',
          'stop-color',
          'opacity',
          'fill-opacity',
          'stroke-opacity',
        ],
      },
      allowedSchemes: [],
      allowedSchemesByTag: {},
      disallowedTagsMode: 'discard',
    });
  }

  /**
   * Optimize image for web delivery
   *
   * Uses balanced compression settings:
   * - JPEG: 85% quality with progressive rendering
   * - PNG: Maximum compression (level 9)
   * - WebP: 85% quality with lossless option for best quality/size balance
   */
  async optimizeImage(buffer: Buffer, _mimeType: string): Promise<Buffer> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
        return await image.jpeg({ quality: 85, progressive: true }).toBuffer();
      } else if (metadata.format === 'png') {
        return await image.png({ compressionLevel: 9 }).toBuffer();
      } else if (metadata.format === 'webp') {
        return await image.webp({ quality: 85 }).toBuffer();
      }

      // If format not recognized, return original
      this.logger.warn('Unsupported format for optimization', {
        format: metadata.format,
      });
      return buffer;
    } catch (error) {
      this.logger.error('Image optimization failed, using original', {
        error: error.message,
      });
      return buffer;
    }
  }

  /**
   * Generate unique filename with timestamp
   */
  generateFileName(originalName: string, imageType: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const sanitizedName = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .toLowerCase();

    return `${imageType}_${sanitizedName}_${timestamp}.${extension}`;
  }

  /**
   * Generate pre-signed URL for private files
   *
   * Creates temporary authenticated URL that expires after specified time.
   * Use for private files that need temporary access.
   *
   * @param fileKey - S3 file key
   * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
   * @returns Pre-signed URL with temporary access
   */
  async generatePresignedUrl(
    fileKey: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });

      this.logger.log('Pre-signed URL generated', {
        file_key: fileKey,
        expires_in: expiresIn,
      });

      return url;
    } catch (error) {
      this.logger.error('Error generating pre-signed URL', {
        file_key: fileKey,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Build appropriate URL based on file visibility
   *
   * Returns public direct URL for public files, or generates
   * pre-signed URL for private files with temporary access.
   *
   * @param fileKey - S3 file key (must include visibility prefix: public/ or private/)
   * @param expiresIn - For private files, URL expiration in seconds (default: 3600 = 1 hour)
   * @returns Public URL or pre-signed URL
   */
  async buildAccessUrl(
    fileKey: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    // Check if file is public based on key prefix
    const isPublic = fileKey.startsWith('public/');

    if (isPublic) {
      // Return direct S3 URL for public files
      return this.buildFileUrl(fileKey);
    } else {
      // Generate pre-signed URL for private files
      return this.generatePresignedUrl(fileKey, expiresIn);
    }
  }
}
