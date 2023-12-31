import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { IconButton } from "react-native-paper";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MapView, { Marker } from "react-native-maps";

import ItemCard from "components/ItemScreen/ItemCard";
import PositionCard from "components/ItemScreen/PositionCard";
import TrackingItemCard from "components/ItemScreen/TrackingItemCard";
import StopTrackingItemCard from "components/ItemScreen/StopTrackingItemCard";
import FindingItemCard from "components/ItemScreen/FindingItemCard";
import StopFindingItemCard from "components/ItemScreen/StopFindingItemCard";
import DeleteItemCard from "components/ItemScreen/DeleteItemCard";
import MapViewDirections from "react-native-maps-directions";

import { useSelector, useDispatch } from "react-redux";
import { mapSettingSelector } from "reduxTKit/selectors";

import { updateControl } from "firebases/realtimeApi";

const GOOGLE_MAPS_APIKEY = "AIzaSyDQHtaJFr0YC9d35d95TBw5IrglHr1ryg8";

const ItemScreen = ({ navigation, route: { params } }) => {
  // Setup BottomSheet:
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  const [isTracking, setIsTracking] = useState(params.mode > 0);
  const [isFinding, setIsFinding] = useState(params.mode == 2);

  const mapSetting = useSelector(mapSettingSelector);
  const dispatch = useDispatch();

  const checkIsValid = () => mapSetting && mapSetting.latitude;

  // region start at user position
  const region = checkIsValid()
    ? mapSetting
    : {
        ...params.userCoords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01 * (Dimensions.get("window").width / 225),
      };

  const origin = {
    latitude: params.userCoords.latitude,
    longitude: params.userCoords.longitude,
  };

  // latitude + longitude cua item tren firebase bi loi
  const destination = params.itemCoords;

  const handleRegionChangeComplete = (region) => {
    dispatch(MapSettingSlice.actions.updateMapSetting(region));
  };

  useEffect(() => {
    if (isTracking) {
      // Change to mode 1 (track object location):
      if (!isFinding) {
        updateControl({ id: params.id, mode: 1 });
      }
      // Change to mode 2 (direct to object location):
      else {
        updateControl({ id: params.id, mode: 2 });
      }
    } else {
      // Change to mode 0 (untrack object location):
      updateControl({ id: params.id, mode: 0 });
    }
  }, [isTracking, isFinding]);

  // renders
  return (
    <View style={styles.container}>
      <MapView
        region={region}
        style={styles.mapContainer}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        <Marker coordinate={params.userCoords} />
        <Marker coordinate={params.itemCoords} />
        {isFinding && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor="hotpink"
            onReady={(result) => console.log(result)}
            onError={(errorMessage) => {
              console.log("GOT AN ERROR");
              console.log(errorMessage);
            }}
          />
        )}
      </MapView>
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
        <BottomSheetView style={styles.bottomView}>
          <View style={styles.backIcon}>
            <IconButton
              size={26}
              icon="arrow-left-circle"
              style={styles.backIcon}
              color="#ffbd24"
              onPress={() => navigation.goBack()}
            />
          </View>
          <ItemCard itemName={params.name} nailStatus={params.mode} />
          <PositionCard
            position={params.latestLocation}
            distance={params.distance}
          />
          {isTracking ? (
            <StopTrackingItemCard setIsTracking={setIsTracking} />
          ) : (
            <TrackingItemCard setIsTracking={setIsTracking} />
          )}
          {isTracking && !isFinding ? (
            <FindingItemCard setIsFinding={setIsFinding} />
          ) : null}
          {isTracking && isFinding ? (
            <StopFindingItemCard setIsFinding={setIsFinding} />
          ) : null}
          <DeleteItemCard />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  backIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  mapContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  bottomView: {
    paddingHorizontal: 20,
  },
});

export default ItemScreen;
