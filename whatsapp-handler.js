class WhatsAppHandler {
  constructor() {
    this.countryCode = '972'; // ברירת מחדל לישראל
  }

  // ניקוי וחיטוב מספר טלפון
  cleanPhoneNumber(phoneNumber) {
    if (!phoneNumber) return null;

    // הסרת כל התווים שאינם ספרות
    let cleaned = phoneNumber.replace(/\D/g, '');

    // טיפול במספרים ישראליים
    if (cleaned.startsWith('0')) {
      // הסרת 0 מהתחלה והוספת קוד מדינה
      cleaned = this.countryCode + cleaned.substring(1);
    } else if (cleaned.startsWith('972')) {
      // המספר כבר מכיל קוד מדינה
      cleaned = cleaned;
    } else if (cleaned.startsWith('+972')) {
      // הסרת + מהתחלה
      cleaned = cleaned.substring(1);
    } else if (cleaned.length === 9) {
      // מספר ישראלי ללא 0 בהתחלה
      cleaned = this.countryCode + cleaned;
    }

    return cleaned;
  }

  // יצירת קישור WhatsApp
  generateWhatsAppLink(phoneNumber, message = '') {
    const cleanedNumber = this.cleanPhoneNumber(phoneNumber);
    
    if (!cleanedNumber) {
      return {
        success: false,
        error: 'מספר טלפון לא תקין'
      };
    }

    // בדיקה שהמספר תקין (לפחות 10 ספרות)
    if (cleanedNumber.length < 10) {
      return {
        success: false,
        error: 'מספר טלפון קצר מדי'
      };
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanedNumber}${message ? `?text=${encodedMessage}` : ''}`;
    
    return {
      success: true,
      url: whatsappUrl,
      cleanedNumber: cleanedNumber,
      formattedNumber: this.formatPhoneNumber(cleanedNumber)
    };
  }

  // עיצוב מספר טלפון לתצוגה
  formatPhoneNumber(phoneNumber) {
    const cleaned = this.cleanPhoneNumber(phoneNumber);
    if (!cleaned) return phoneNumber;

    if (cleaned.startsWith('972')) {
      // מספר ישראלי
      const localNumber = cleaned.substring(3);
      return `+972-${localNumber.substring(0, 2)}-${localNumber.substring(2)}`;
    }

    return `+${cleaned}`;
  }

  // פתיחת WhatsApp
  openWhatsApp(phoneNumber, message = '') {
    const result = this.generateWhatsAppLink(phoneNumber, message);
    
    if (!result.success) {
      return result;
    }

    try {
      // בדיקה אם זה Electron או דפדפן
      if (typeof require !== 'undefined') {
        // Electron
        const { shell } = require('electron');
        shell.openExternal(result.url);
      } else {
        // דפדפן
        window.open(result.url, '_blank');
      }

      return {
        success: true,
        message: 'WhatsApp נפתח בהצלחה',
        url: result.url
      };
    } catch (error) {
      console.error('שגיאה בפתיחת WhatsApp:', error);
      return {
        success: false,
        error: 'שגיאה בפתיחת WhatsApp'
      };
    }
  }

  // בדיקת תקינות מספר טלפון
  validatePhoneNumber(phoneNumber) {
    const cleaned = this.cleanPhoneNumber(phoneNumber);
    
    if (!cleaned) {
      return {
        valid: false,
        error: 'מספר טלפון ריק או לא תקין'
      };
    }

    if (cleaned.length < 10) {
      return {
        valid: false,
        error: 'מספר טלפון קצר מדי'
      };
    }

    if (cleaned.length > 15) {
      return {
        valid: false,
        error: 'מספר טלפון ארוך מדי'
      };
    }

    // בדיקה למספרים ישראליים
    if (cleaned.startsWith('972')) {
      const localPart = cleaned.substring(3);
      const validPrefixes = ['50', '52', '53', '54', '55', '58', '59']; // קידומות נייד
      const mobilePrefix = localPart.substring(0, 2);
      
      if (validPrefixes.includes(mobilePrefix)) {
        return {
          valid: true,
          type: 'mobile',
          country: 'Israel'
        };
      }
    }

    return {
      valid: true,
      type: 'unknown',
      country: 'unknown'
    };
  }

  // הגדרת קוד מדינה חדש
  setCountryCode(countryCode) {
    this.countryCode = countryCode.replace(/\D/g, '');
  }

  // קבלת קוד המדינה הנוכחי
  getCountryCode() {
    return this.countryCode;
  }
}

// פונקציות עזר לשימוש קל
const whatsappHandler = new WhatsAppHandler();

// פונקציות גלובליות לשימוש בממשק
window.openWhatsApp = (phoneNumber, message = '') => {
  return whatsappHandler.openWhatsApp(phoneNumber, message);
};

window.validatePhone = (phoneNumber) => {
  return whatsappHandler.validatePhoneNumber(phoneNumber);
};

window.formatPhone = (phoneNumber) => {
  return whatsappHandler.formatPhoneNumber(phoneNumber);
};

module.exports = WhatsAppHandler;