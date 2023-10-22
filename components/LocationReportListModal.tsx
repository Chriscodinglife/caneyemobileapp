import React from 'react';
import { Review } from './Location';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button} from 'react-native';

type LocationReportListModalProps = {
    reviews?: Review[];
    closeMarkerModal: () => void;
}



const LocationReportListModal: React.FC<LocationReportListModalProps> = ({ reviews, closeMarkerModal }) => {
  return (
    <View style={styles.scrollReviews}>
      <ScrollView>
        { reviews?.map( (review, index) => { 
          return ( 
            <View key={index} style={styles.reviewRow}>
              { review.imageUri ? (
                  <>
                  <Image source={{ uri: review.imageUri}} style={styles.imageUriStyle} />
                  </>
                )
              : (<></>) }
                <View style={styles.text}>
                  <Text style={styles.date}>{review.date}</Text>
                  <Text style={styles.user}>- {review.user}</Text>
                </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
    scrollReviews: {
      flex: 1,
      backgroundColor: "#faf0e64D",
      padding: 20
    },
    reviewRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      margin: 5,
      padding: 25,
      backgroundColor: 'white',
      borderRadius: 10,
      gap: 30,
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { height: 2, width: 0}

    },
    text: {
      flex: 1,
      flexDirection: 'column',
      paddingLeft: 10
    },
    date: {
      alignSelf: 'flex-end',
      fontSize: 10,
      color: 'grey'
    },
    message: {
      fontSize: 12,
    },
    user: {
      fontSize: 9,
    },
    imageUriStyle: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignSelf: 'center',
      justifyContent: 'center'
    },
  });

export default LocationReportListModal