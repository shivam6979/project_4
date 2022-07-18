


const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false;
    if (typeof value === "string" && value.trim().length == 0) return false;
    if (typeof value === "string") return true;
  };

  const isValidReqBody = function (reqbody) {
    if (!Object.keys(reqbody).length) {
      return false;
    }
    return true;
  };

