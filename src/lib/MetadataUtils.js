import metadataAPI from "@/api/metadata";

export async function addTag(objectId, objectClass, newTag, reloadCallback) {
  await metadataAPI.addTag({ objectId, objectClass, tag: newTag });
  if (reloadCallback) {
    await reloadCallback();
  }
}

export async function deleteTag(objectId, objectClass, tag, reloadCallback) {
  await metadataAPI.removeTag({ objectId, objectClass, tag });
  if (reloadCallback) {
    await reloadCallback();
  }
}

export async function addProperty(objectId, objectClass, newProperty, reloadCallback) {
  await metadataAPI.addProperty({
    objectId,
    objectClass,
    propertyName: newProperty.name,
    propertyValue: newProperty.value,
  });
  if (reloadCallback) {
    await reloadCallback();
  }
}

export async function deleteProperty(objectId, objectClass, property, reloadCallback) {
  await metadataAPI.removeProperty({
    objectId,
    objectClass,
    propertyName: property.propertyName,
  });
  if (reloadCallback) {
    await reloadCallback();
  }
}
