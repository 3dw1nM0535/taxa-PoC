export function truncateAddress(addressString, length) {
	if (addressString.length <= length) {
		return addressString
	}
	return addressString.slice(0, length) + '.....'
}
