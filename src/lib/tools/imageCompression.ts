/**
 * Resizes and re-encodes an image data URL to keep uploads (stored as base64 directly
 * in the database, with no separate image storage) from bloating list responses —
 * a single uncompressed photo can be several megabytes, and that gets sent down on
 * every visit to a grid that shows dozens of them at once.
 */
export function compressImageDataUrl(
	dataUrl: string,
	maxWidth = 600,
	maxHeight = 900,
	quality = 0.8
): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
			const width = Math.round(img.width * scale);
			const height = Math.round(img.height * scale);

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				resolve(dataUrl);
				return;
			}

			ctx.drawImage(img, 0, 0, width, height);
			resolve(canvas.toDataURL('image/jpeg', quality));
		};
		img.onerror = reject;
		img.src = dataUrl;
	});
}
