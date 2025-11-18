/**
 * Redimensiona uma imagem para um tamanho máximo específico
 * @param file - Arquivo de imagem original
 * @param maxWidth - Largura máxima (padrão: 800px)
 * @param maxHeight - Altura máxima (padrão: 600px)
 * @param quality - Qualidade da compressão (0-1, padrão: 0.8)
 * @returns Promise<File> - Arquivo redimensionado
 */
export const resizeImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Erro ao processar a imagem'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Erro ao carregar a imagem'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Processa múltiplos arquivos de imagem redimensionando-os
 * @param files - Array de arquivos de imagem
 * @param maxWidth - Largura máxima
 * @param maxHeight - Altura máxima
 * @param quality - Qualidade da compressão
 * @returns Promise<File[]> - Array de arquivos redimensionados
 */
export const resizeMultipleImages = async (
  files: File[],
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<File[]> => {
  const resizePromises = files.map(file => 
    resizeImage(file, maxWidth, maxHeight, quality)
  );
  
  return Promise.all(resizePromises);
};

/**
 * Valida se o arquivo é uma imagem
 * @param file - Arquivo para validar
 * @returns boolean
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Valida o tamanho do arquivo
 * @param file - Arquivo para validar
 * @param maxSizeInMB - Tamanho máximo em MB (padrão: 5MB)
 * @returns boolean
 */
export const isValidFileSize = (file: File, maxSizeInMB: number = 5): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};