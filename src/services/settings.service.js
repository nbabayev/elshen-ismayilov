import { Settings } from "@/models";
import { uploadImage } from "@/@lib/api/cloudinary";

export async function getSettings() {
  const settings = await Settings.findOne({
    order: [["LastUpdate", "DESC"]],
  });
  return settings;
}

export async function updateSettings(payload) {
  const settings = await getSettings();

  // Handle file uploads if present
  const imageFields = ["LogoHeader", "LogoFooter", "SubscribeImage"];
  for (const field of imageFields) {
    if (payload[field] instanceof File) {
      payload[field] = await uploadImage(payload[field]);
    }
  }

  if (settings) {
    const { Id, CreatedDate, LastUpdate, ...rest } = payload;
    await settings.update(rest);
    return settings;
  } else {
    return await Settings.create(payload);
  }
}
