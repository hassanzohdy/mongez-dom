import { AttributesList } from "./types";

export function attributesList(domElement: HTMLElement): AttributesList {
  const attributesList: AttributesList = {};

  for (const attribute of domElement.attributes) {
    attributesList[attribute.name] = attribute.value;
  }

  return attributesList;
}
