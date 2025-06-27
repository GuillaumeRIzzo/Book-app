const getCountryCode = (isoCode: string): string => {
  return isoCode.split('-')[1]?.toLowerCase() || '';
}

export default getCountryCode;