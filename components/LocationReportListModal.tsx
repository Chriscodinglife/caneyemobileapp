import { Review, MachineStatus, Location } from './Location';
import ReportBox from './reportBox';
import React, { useState, Dispatch, SetStateAction, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button, Modal, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';

interface LocationReportListModalProps {
    location: Location;
    isLocationReportListModalVisible: boolean;
    closeLocationReportListModal: Dispatch<SetStateAction<boolean>>;
}

interface ExtendedReview extends Review {
  finish: number;
}

const { width, height } = Dimensions.get('window');

const LocationReportListModal: React.FC<LocationReportListModalProps> = (props: LocationReportListModalProps) => {

  
	// current is for get the current content is now playing
	const [current, setCurrent] = useState(0);
	// if load true then start the animation of the bars at the top
	const [load, setLoad] = useState(false);
	// progress is the animation value of the bars content playing the current state
	const progress = useRef(new Animated.Value(0)).current;
  const [content, setContent] = useState<ExtendedReview[]>((props.location.reviews as ExtendedReview[]));
  
  console.log(props.location.reviews?.length)
  console.log(content.length);

  console.log(content);

  const start = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false
    }).start(({ finished }) => {
      if (finished) {
        next();
      };
    });
  };


  // handle playing the animation
  const play = () => {
		start();
	};

	// next() is for changing the content of the current content to +1
  const next = () => {
		// check if the next content is not empty

		if (current !== (content.length as number) - 1) {
			let data = [...content];
			data[current].finish = 1;
			setContent(data);
			setCurrent(current + 1);
			progress.setValue(0);
			setLoad(false);
		} else {
			// the next content is empty
			close();
		};
	};

  // previous() is for changing the content of the current content to -1
	const previous = () => {
		// checking if the previous content is not empty
		if (current - 1 >= 0) {
			let data = [...content];
			data[current].finish = 0;
			setContent(data);
			setCurrent(current - 1);
			progress.setValue(0);
			setLoad(false);
		} else {
			// the previous content is empty
			close();
		};
	};

  // closing the modal set the animation progress to 0
	const close = () => {
		progress.setValue(0);
		setLoad(false);
    setCurrent(0);
		props.closeLocationReportListModal(false);
	};

  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={props.isLocationReportListModalVisible}
      onRequestClose={() => props.closeLocationReportListModal(false)}>
        <View style={styles.containerModal}>

					<View style={styles.backgroundContainer}>
            <Image onLoadEnd={() => {
									progress.setValue(0);
									play();
								}}
								source={{ uri: content[current]?.imageUri as string}}
								style={styles.reportImage}
							/>
					</View>

					<View style={styles.reportInteractions}>

						{/* ANIMATION BARS */}
						<View style={styles.animationBars}>
							{content.map((index, key) => {
								return (
									// THE BACKGROUND
									<View key={key} style={styles.animationBarsBackground} >
                    {/* THE ANIMATION OF THE BAR*/}
                    <Animated.View
											style={{
												flex: current == key ? progress : content[key].finish,
												height: 2,
												backgroundColor: 'rgba(255, 255, 255, 1)',
											}}/>
									</View>
								);
							})}
						</View>

						{/* END OF ANIMATION BARS */}

						<View style={styles.reportImageHeader}>
							{/* THE AVATAR AND USERNAME  */}
							<View style={styles.reportHeaderDate}>
								<Text style={styles.reportHeaderDateText}>
									Posted on {content[current]?.date}
								</Text>
							</View>
							{/* END OF THE AVATAR AND USERNAME */}

							{/* THE CLOSE BUTTON */}
							<TouchableOpacity onPress={() => close()}>
								<View style={styles.closeButtonStyle}>
									<Ionicons name="ios-close" size={28} color="white" />
								</View>
							</TouchableOpacity>
							{/* END OF CLOSE BUTTON */}
						</View>

						{/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
						<View style={styles.leftRightPressStyle}>
							<TouchableWithoutFeedback onPress={() => previous()}>
								<View style={{ flex: 1 }}></View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback onPress={() => next()}>
								<View style={{ flex: 1 }}></View>
							</TouchableWithoutFeedback>
						</View>
						{/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}

					</View>
				</View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  reportsMainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#1648FA",
    padding: 30,
    justifyContent: 'space-between',
  },
  reportImage: { 
    width: width, 
    height: height, 
    resizeMode: 'cover'
  },
  reportInteractions: {
    flexDirection: 'column',
    flex: 1,
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  animationBars: {
    flexDirection: 'row',
    paddingTop: 80,
    paddingHorizontal: 10,
  },
  animationBarsBackground: {
    height: 2,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(117, 117, 117, 0.5)',
    marginHorizontal: 2,
  },
  animatingTheBars: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  reportImageHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  reportHeaderDate: { 
    flexDirection: 'row',
     alignItems: 'center' 
  },
  reportHeaderDateText: {
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 10,
  },
  closeButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 15,
  },
  leftRightPressStyle: { 
    flex: 1, 
    flexDirection: 'row' 
  },
    headerBox: {
        alignItems: 'flex-start',
        paddingTop: 60
    },
    mainHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    scrollView: {
      marginVertical: 30,
    },
    scrollViewContentStyle: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 30,
      paddingVertical: 20
    },
    recentReviewBox: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
      alignItems: 'center',
      borderRadius: 10,
      padding: 20,
      shadowColor: "black",
      shadowOpacity: 0.3,
      shadowRadius: 15,
      shadowOffset: {width: 0, height: 10},
    },
    reviewBoxHeader: {
      alignSelf: 'flex-start',
      fontSize: 17,
      fontWeight: '600'
    },
    reviewBoxGoodMachinesView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
      padding: 10,
      margin: 10,
      backgroundColor: '#F6F5F1',
      borderRadius: 20
    },
    reportNumber: {
      fontWeight: 'bold',
      fontSize: 30,
    },
    reportNumberText: {
      fontSize: 17,
      fontWeight: '600'
    },
    reviewGlassLeftColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 30,
      height: '100%',
      borderRightColor: 'grey',
      borderRightWidth: 1,
      padding: 20,
    },
    reviewCanMiddleColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 30,
      height: '100%',
      borderRightColor: 'grey',
      borderRightWidth: 1,
      padding: 20
    },
    reviewBottleRightColumn: {
      flex: 1, 
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 30,
      height: '100%',
      borderRightColor: 'grey',
      padding: 20
    },
    reportBoxFooter: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%',
      paddingBottom: 5
    },
    reportBoxDate: {
      fontSize: 16
    },
    closeButton: {
      backgroundColor: 'white',
      padding: 16,
      alignItems: 'center',
      borderRadius: 10
    },
    closeButtonText: {
      color: 'black',
      fontSize: 20,
      fontWeight: '700'
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerModal: {
      flex: 1,
      backgroundColor: '#000',
    },
    backgroundContainer: {
      position: 'absolute',
  
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

export default LocationReportListModal