import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';

export class Message {
  message: string;

  type: 'error' | 'info';

  constructor(message: string, type: 'error' | 'info') {
    this.message = message;
    this.type = type;
  }

  showMessage(): void {
    Toastify({
      text: this.message,
      duration: 3000,
      backgroundColor: this.getBackgroundColor(),
    }).showToast();
  }

  getBackgroundColor(): string {
    switch (this.type) {
      case 'error':
        return 'linear-gradient(to right, #ff8585, #db4c43)';
      case 'info':
        return 'linear-gradient(to right, #3994a4, #3d93a3)';
      default:
        return 'linear-gradient(to right, #3994a4, #3d93a3)';
    }
  }
}
