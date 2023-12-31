import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "react-native-paper";
import { updateUserAvatar, uploadImageAsync } from "firebases/firestoreApi";

const ItemImagePicker = ({ image, setImage, uid = "" }) => {
  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      if (uid) {
        await uploadImageAsync(uid, result.uri)
          .then((imgUrl) => {
            updateUserAvatar(imgUrl, uid);
          })
          .catch((e) => console.log(e));
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.6} onPress={pickImage}>
        <View>
          <Avatar.Image
            size={90}
            source={image ? { uri: image } : require("assets/user-icon.png")}
            style={styles.itemImg}
          />
          <Avatar.Icon size={24} icon="camera" style={styles.iconSuffix} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    alignItems: "center",
  },
  itemImg: {
    backgroundColor: "#ffffff",
    borderColor: "#CCCDC6",
    borderWidth: 1,
  },
  iconSuffix: {
    position: "absolute",
    bottom: 0,
    right: "10%",
  },
});

export default ItemImagePicker;
