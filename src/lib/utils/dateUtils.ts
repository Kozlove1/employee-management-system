export function formatDate(dateStr: string): string {
	if (!dateStr) return "";

	try {
		// Handle ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
		if (dateStr.includes("T") || dateStr.includes("-")) {
			const date = new Date(dateStr);
			if (isNaN(date.getTime())) return dateStr;

			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const year = date.getFullYear();
			return `${day}.${month}.${year}`;
		}

		// Handle dd.mm.yyyy format
		const [day, month, year] = dateStr.split(".");
		if (day && month && year) {
			return `${day}.${month}.${year}`;
		}

		return dateStr;
	} catch {
		return dateStr;
	}
}

export function getLocalDateTime(): string {
	const now = new Date();
	// Return ISO string format that API expects: 2006-01-02T15:04:05Z07:00
	return now.toISOString();
}
