const Constants = {
  USER_STATUS: {
    PENDING: 0,
    APPROVED: 1,
    REQUEST_DOCUMENT: 1,
    DELETED: 3,
    BLOCK: 1,
    UNBLOCKED: 0
},
EMAIL_TEMPLATES: {
  REJECTED: 'rejected',
  VERIFIED: 'approved',
  BLOCKED: 'blocked',
  REQUEST_DOCUMENT: 'request_document',
  P_LICENSE: 'plicense',
  UNDER_AGE: 'under_age',
  SUMMON: 'summon',
  VIOLATION: 'violation',
  REQUEST_PHONE: 'request_phone',
},

REJECTED_STATUS: {
  UNDER_AGE: 1,
  P_LICENSE: 2,
  REQUEST_DOCUMENT: 3,
  REQUEST_PHONE: 4,
  SUMMON: 5,
  OTHER: 6
},

AUDIT_TYPE: {
  REJECTED: 1,
  BLOCKED: 2,
  UNBLOCKED: 3,
  VERIFIED: 4,
  ADD_TO_BLACKLIST: 5,
  REMOVE_FROM_BLACKLIST: 6,
  TOPUP: 7,
  RATING: 8
},
              
SMS_VERIFIED: 'Your GoCar account has been VERIFIED. Use promo code NEWTOGOCAR and enjoy RM15 off your first reservation. Drive today.'

}

module.exports = Constants

