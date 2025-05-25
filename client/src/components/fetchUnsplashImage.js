// src/components/fetchUnsplashImage.js

export const fetchUnsplashImage = async (query) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=LTlVl6vaEoAbdfsBgIsqa-WQ1vYEBybuv9RDQjc4owg`
    );
    const data = await response.json();
    return data.urls.small; // or data.urls.regular if you want higher resolution
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
};
