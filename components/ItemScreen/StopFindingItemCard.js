import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Avatar } from "react-native-paper";

const StopFindingItemCard = ({ setIsFinding }) => {
  return (
    <TouchableWithoutFeedback onPress={() => setIsFinding(false)}>
      <View style={styles.container}>
        <Avatar.Icon
          size={24}
          icon="stop"
          style={styles.icon}
          color="#3F63DB"
        />
        <Text style={styles.action}>Stop finding item</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    backgroundColor: "#3F63DB",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 20,
  },
  icon: {
    backgroundColor: "#F1F5FB",
    marginBottom: 5,
  },
  action: {
    color: "#FFFFFF",
    fontWeight: "700",
    lineHeight: 20,
  },
});

export default StopFindingItemCard;
