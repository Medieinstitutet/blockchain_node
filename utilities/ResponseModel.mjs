class ResponseModel {
  constructor(options = {}) {
    this.statusCode = options.statusCode || 200;
    this.success = options.success !== undefined ? options.success : true;
    this.message = options.message || '';
    this.data = options.data || {};
  }

  // Method to send the response
  send(res) {
    res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export default ResponseModel;
