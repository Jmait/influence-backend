function SuccessResponse(data: any, message: string = 'Success') {
  return {
    status: 'success',
    message,
    data,
  };
}

export { SuccessResponse };
