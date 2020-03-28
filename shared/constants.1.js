const Constants = {
    DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss z',
    BUFFER_LENGTH: 1,
    IS_BUFFER: 1,
    HOUR: 1,
    DAY: 24,
    MONTH: 24 * 30,
    GOCAR_TOKEN: 'gocar_token',
    DEFAULT_NUMBER_ITEMS: 4,
    MERCHANTKEY_BC : 'CFa7zlMyF0',
    MERCHANTCODE_BC : 'M12870_S0001',
    MERCHANTKEY : 'dGPElNXuJS',
    MERCHANTCODE : 'M12870',
    // M12870_S0001  :  Bind Card (card registration for both Credit & Debit Card) & Non 3D processing (no OTP) 
    //M12870 : 3D processing with OTP (for debit card subsequent charge)
    RESPONDURL : 'http://54.169.17.196/ipay88/response.php',
    BACKENDURL : 'http://54.169.17.196/ipay88/backend.html',
    DURING_TRIP: 'DURING_TRIP',
    QR_SCANNER:'Invalid QR Code.',
    END_TRIP: 'END_TRIP',
    BEFORE_TRIP: 'BEFORE_TRIP',
    CREDIT_TYPE: {
        PAYMENT: 4,
        FRIEND_REFERAL: 1,
        REFUND: 3
    },
    CAR_OWNER: {
        TCCR: 'tccr',
        GOCAR: 'gocar'
    },
    USER_STATUS: {
        PENDING: 0,
        APPROVED: 1,
        DELETED: 3,
        BLOCK: 1
    },
    EMPLOYEE_STATUS: {
        APPROVED: 1,
        PENDING: 0,
        REJECTED: 2
    }
}

module.exports = Constants
