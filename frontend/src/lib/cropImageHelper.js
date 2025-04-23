// Function to create an HTML image element from a URL
export const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // To avoid CORS issues
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  
  // Function to crop the image based on croppedAreaPixels
  export const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    // Set canvas size to the cropped area dimensions
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
  
    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      croppedAreaPixels.x, // Start X
      croppedAreaPixels.y, // Start Y
      croppedAreaPixels.width, // Width of the cropped area
      croppedAreaPixels.height, // Height of the cropped area
      0, // Place X on the canvas
      0, // Place Y on the canvas
      croppedAreaPixels.width, // Canvas width
      croppedAreaPixels.height // Canvas height
    );
  
    // Convert canvas content to a blob (image file)
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(URL.createObjectURL(blob)); // Return image URL
      }, "image/jpeg");
    });
  };
  