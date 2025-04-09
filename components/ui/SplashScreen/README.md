# Splash Screen Instructions

To create a splash screen with the blue circle surrounding the logo:

1. Install the necessary packages:
   ```
   npm install canvas
   ```

2. Run the script to generate the splash image:
   ```
   node components/ui/SplashScreen/createSplashAsset.js
   ```

3. This will create a `splash.png` file in the assets/images directory that has:
   - Dark background
   - Blue circular border
   - Your logo with proper styling

4. The app.json configuration automatically uses this image for both the native and JavaScript splash screens.

## Alternative Method

If the canvas package is difficult to install, you can create this image manually using any image editor:

1. Create a 1024x1024 pixel image with a dark background (#121212)
2. Add a blue circle (#3B82F6) in the center (600px diameter)
3. Add a dark circle (#121212) inside the blue circle (420px diameter)
4. Place your logo in the center of the dark circle 