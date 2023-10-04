import React from 'react';
import { Review } from './Location';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button} from 'react-native';

type LocationReviewListProps = {
    reviews?: Review[];
    closeMarkerModal: () => void;
}



const LocationReviewList: React.FC<LocationReviewListProps> = ({ reviews, closeMarkerModal }) => {
  return (
    <View style={styles.masterView}>
      <ScrollView>
        { reviews?.map( (review, index) => { 
          return ( 
            <View key={index} style={styles.listItem}>
              { review.imageUri ? (
                  <>
                  <Image source={{ uri: review.imageUri}} style={styles.imageUriStyle} />
                  </>
                )
              : (<></>) }
                <View style={styles.text}>
                  <Text style={styles.date}>{review.date}</Text>
                  <Text style={styles.message}>{review.message}</Text>
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
    masterView: {
      flexGrow: 1,
      flexDirection: 'column',
      paddingHorizontal: 20
    },
    listItem: {
      flex: 1,
      flexDirection: 'row',
      height: 75,
      padding: 15,
      margin: 10,
      backgroundColor: 'white',
      borderRadius: 5,
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

export default LocationReviewList