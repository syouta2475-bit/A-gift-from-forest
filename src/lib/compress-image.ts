/**
 * フロントエンド Canvas による EXIF 物理完全消去 ＆ 画像リサイズ
 * HTML <canvas> にピクセルを描画して toBlob することで、
 * スマホ写真の GPS 位置情報などの EXIF メタデータを 100% 物理的に削除します。
 */

export async function compressAndStripExif(
  file: File,
  maxDimension = 1200,
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // アスペクト比を維持して長辺を maxDimension に縮小
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context is not available"));
        return;
      }

      // ピクセル描画（メタデータは一切引き継がれません）
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to export clean canvas blob"));
            return;
          }

          // EXIF 完全消去済みの新しいクリーンな File オブジェクト
          const cleanFile = new File([blob], "review-clean.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(cleanFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

/** 互換用関数名 */
export const compressReviewPhoto = compressAndStripExif;
