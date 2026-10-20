# How to Add Your Profile Image to the Modal

## Option 1: Save Image Locally (Recommended)

1. **Save your image:**
   - Save the profile photo as `profile-photo.jpg`
   - Place it in: `TUZA/assets/images/profile-photo.jpg`

2. **Update the code in `form.tsx`:**
   ```typescript
   <Image
     source={require('@/assets/images/profile-photo.jpg')}
     style={styles.modalImage}
     resizeMode="cover"
   />
   ```

## Option 2: Use Web URL (Current Setup)

The modal currently uses a placeholder image from Unsplash. To use your own image:

1. **Upload your image to an image hosting service:**
   - Imgur: https://imgur.com
   - Cloudinary: https://cloudinary.com
   - Or any other image host

2. **Update the URI in `form.tsx`:**
   ```typescript
   <Image
     source={{ uri: 'YOUR_IMAGE_URL_HERE' }}
     style={styles.modalImage}
     resizeMode="cover"
   />
   ```

## Option 3: Use Base64 (For Testing)

If you want to embed the image directly:

1. Convert image to base64
2. Use in code:
   ```typescript
   <Image
     source={{ uri: 'data:image/jpeg;base64,YOUR_BASE64_STRING' }}
     style={styles.modalImage}
     resizeMode="cover"
   />
   ```

## Current Implementation

The modal is currently set up with:
- **Title:** "Profile Image"
- **Description:** Modal explanation
- **Image size:** Full width, 400px height
- **Image style:** Rounded corners
- **Placeholder:** Unsplash stock photo

## To Test

1. Refresh your browser at `http://localhost:8083/form`
2. Click "View Profile Image" button
3. The modal will open with the image
4. Click "Close Modal" to dismiss

## Recommended Next Steps

1. Save your profile photo to `TUZA/assets/images/profile-photo.jpg`
2. Update line ~238 in `form.tsx` to use the local image
3. Restart the Expo server if needed
