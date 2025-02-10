

/**
 * Checks if a given string contains a given substring.
 *
 * @param {string} string - The string to check.
 * @param {string} substring - The substring to search for.
 * @returns {boolean} Whether the string contains the substring.
 */
export function contains(string, substring) {
  const regex = new RegExp(`.*${substring}.*`)
  return regex.test(string)
}

/**
 * Checks if a given string is not empty and not null.
 *
 * @param {string} string - The string to check.
 * @returns {boolean} Whether the string is not empty and not null.
 */
export function notEmpty(string) {
  return string != '' && string != null
}


/**
 * Formats an Ethereum address to a shortened version for display purposes.
 *
 * This function takes an Ethereum address and returns a string with the first
 * 6 characters, followed by an ellipsis, and the last 4 characters of the address.
 *
 * @param {string} address - The Ethereum address to format.
 * @returns {string} The formatted Ethereum address.
 */
export function formatEthereumAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
