import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { Dropdown } from "react-native-element-dropdown";
import useAuthStore from "@/store/store";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useRouter } from "expo-router";
import Loader from "./components/ui/Loader";
type Props = {};
type Beneficiary = {
  [x: string]: string;
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
};
type DecodedToken = {
  email: string;
};
const Benifiary = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [beneficiaryId, setBeneficiaryId] = useState<String>("");
  const [validation, setValidation] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    meterNumber: "",
    municipality: "",
  });
  const data = [
    { label: "Dihlabeng", value: "dihlabeng" },
    { label: "Maluti-a-Phofung", value: "maluti-a-phofung" },
    { label: "Mantsopa", value: "mantsopa" },
    { label: "Nketoana", value: "nketoana" },
    { label: "Phumelela", value: "phumelela" },
    { label: "Setsoto", value: "setsoto" },
    { label: "Emfuleni", value: "emfuleni" },
    { label: "Merafong City", value: "merafong-city" },
    { label: "Mogale City", value: "mogale-city" },
    { label: "Rand West City", value: "rand-west-city" },
    { label: "Midvaal", value: "midvaal" },
    { label: "Lesedi", value: "lesedi" }
  ];
  const [value, setValue] = useState("");
  const { authToken, logout } = useAuthStore();
  const [reload, setReload] = useState(false);
  const [newRecord, setRecord] = useState(false);
  const [buyingElectricity, setBuyingElectricity] = useState(false);
  const [cost, setCost] = useState("");
  const [validationCost, setValidationCost] = useState("");
  useEffect(() => {
    const getBeneficiaries = async () => {
      setLoading(true);
      await axios
        .get(`${process.env.EXPO_PUBLIC_SMART_METER_BACKEND}/api/v1/beneficiaries`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((data) => {
          setLoading(false)
          setBeneficiaries(data.data.data);
          setModalVisible(false);
        })
        .catch((error) => {
          setLoading(false)
          console.log(error.response);
        });
    };
    getBeneficiaries();
  }, [reload]);
  const handleAddBeneficiary = async () => {
    const errors = {
      firstname: firstname === "" ? "Firstname required" : "",
      lastname: lastname === "" ? "Lastname required" : "",
      phoneNumber:
        phoneNumber === ""
          ? "Phone number required"
          : phoneNumber.length !== 10
          ? "Phone number must be 10 digits"
          : "",
      meterNumber:
        meterNumber === ""
          ? "Meter number required"
          : !/^\d+$/.test(meterNumber)
          ? "Meter number must contain only numbers"
          : "",
      municipality: value === "" ? "Select municipality" : "",
    };

    setValidation(errors);
    if (Object.values(errors).some((error) => error !== "")) return;
    setLoading(true);
    const body = {
      municipality: value,
      firstname,
      lastname,
      phoneNumber,
      meterNumber,
    };
    if (newRecord) {
      await axios
        .post(`${process.env.EXPO_PUBLIC_SMART_METER_BACKEND}/api/v1/beneficiaries`, body, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((data) => {
          setLoading(false)
          setReload(!reload);
          setModalVisible(false);
          setFirstname("");
          setLastname("");
          setPhoneNumber("");
          setMeterNumber("");
          setValue("");
        })
        .catch((error) => {
          setLoading(false)
          if (
            error.response.data.error &&
            error.response.data.error.length > 0
          ) {
            Alert.alert("Error", error.response.data.error);
          } else {
            Alert.alert("Error", "Client server error");
          }
        });
    } else {
      await axios
        .put(
          `${process.env.EXPO_PUBLIC_SMART_METER_BACKEND}/api/v1/beneficiaries/${beneficiaryId}`,
          body,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )
        .then((data) => {
          setLoading(false)
          setReload(!reload);
          setModalVisible(false);
          setFirstname("");
          setLastname("");
          setPhoneNumber("");
          setMeterNumber("");
          setBeneficiaryId("");
          setValue("");
        })
        .catch((error) => {
          setLoading(false)
          if (
            error.response.data.error &&
            error.response.data.error.length > 0
          ) {
            Alert.alert("Error", error.response.data.error);
          } else {
            Alert.alert("Error", "Client server error");
          }
        });
    }
  };
  const handleDeleteBeneficiary = async (id: String) => {
    setLoading(true);
    await axios
      .delete(`${process.env.EXPO_PUBLIC_SMART_METER_BACKEND}/api/v1/beneficiaries/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((data) => {
        setLoading(false)
        setReload(!reload);
      })
      .catch((error) => {
        setLoading(false)
        if (error.response.data.error && error.response.data.error.length > 0) {
          Alert.alert("Error", error.response.data.error);
        } else {
          Alert.alert("Error", "Client server error");
        }
      });
  };
  const handleEditBeneficiary = (id: string) => {
    const beneficiaryEdit = beneficiaries.find(
      (beneficiary) => beneficiary.id === id
    );
    setModalVisible(true);
    setBuyingElectricity(false);
    setFirstname(beneficiaryEdit?.firstname || "");
    setLastname(beneficiaryEdit?.lastname || "");
    setPhoneNumber(beneficiaryEdit?.phoneNumber || "");
    setMeterNumber(beneficiaryEdit?.meterNumber || "");
    setValue(beneficiaryEdit?.municipality || "");
    setRecord(false);
    setBeneficiaryId(id);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setFirstname("");
    setLastname("");
    setPhoneNumber("");
    setMeterNumber("");
    setBeneficiaryId("");
    setValue("");
  };
  const handleBuyElectricityModal = (id: String) => {
    setModalVisible(true);
    setBuyingElectricity(true);
    setBeneficiaryId(id);
  };
  const handleBuyElectricity = async () => {
    const isNumberOnly = (input: string) => /^\d+$/.test(input);
    if (cost === "") {
      setValidationCost("Enter the amount");
      return;
    }
    if (!isNumberOnly(cost)) {
      setValidationCost("Only numbers is allowed");
      return;
    }
    if(parseFloat(cost) < 9) {
      setValidationCost("Minimum amount is 10");
      return;
    }
    const decodedToken = jwtDecode<DecodedToken>(authToken);
    router.push(`/payment?email=${decodedToken.email}&amount=${cost}&beneficiaryId=${beneficiaryId}`);
  }
  const handleTransactionHistory = (id: string) => {
    router.push(`/transaction_history?id=${id}`)
  }
  return (
    <View style={styles.container}>
      {beneficiaries.length > 0 ? (
        <ScrollView>
          {beneficiaries.map((beneficiary) => (
            <View style={styles.beneficiaryContainer} key={beneficiary.id}>
              <View style={styles.beneficiary} key={beneficiary.id}>
                <View style={styles.beneficiaryDetails}>
                  <View style={styles.beneficiaryIcon}>
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={55}
                      color="#F87315"
                    />
                  </View>
                  <View style={styles.beneficiaryBody}>
                    <Text style={styles.name}>
                      {beneficiary.firstname} {beneficiary.lastname}
                    </Text>
                    <Text style={styles.phoneNumber}>
                      {beneficiary.phoneNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color="#5D4037"
                    style={{ marginRight: 10 }}
                    onPress={() => handleEditBeneficiary(beneficiary.id)}
                  />
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color="#EF4444"
                    onPress={() => handleDeleteBeneficiary(beneficiary.id)}
                  />
                </View>
              </View>
              <View style={styles.buttonActionContainer}>
                <TouchableHighlight
                  style={styles.buyingActionButton}
                  onPress={() => handleBuyElectricityModal(beneficiary.id)}>
                  <Text style={styles.buyingActionText}>
                    Buy Electricity
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[styles.buyingActionButton, {marginLeft: 10}]}
                  onPress={() => handleTransactionHistory(beneficiary.id)}>
                  <Text style={styles.buyingActionText}>
                    Transaction History
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noResults}>
          <MaterialCommunityIcons
            name="account-outline"
            size={125}
            color="#F87315"
          />
          <Text style={{ fontSize: 25 }}>No beneficiaries yet</Text>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        {!buyingElectricity ? (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeader}>Add Beneficiary</Text>
              <View style={styles.modalBody}>
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Input
                    text={firstname}
                    setText={setFirstname}
                    placeholder={"First Name"}
                    isPassword={false}
                  />
                  {!!validation.firstname && (
                    <Text style={styles.error}>{validation.firstname}</Text>
                  )}
                </View>
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Input
                    text={lastname}
                    setText={setLastname}
                    placeholder={"Last Name"}
                    isPassword={false}
                  />
                  {!!validation.lastname && (
                    <Text style={styles.error}>{validation.lastname}</Text>
                  )}
                </View>
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Input
                    text={phoneNumber}
                    setText={setPhoneNumber}
                    placeholder={"Phone Number"}
                    isPassword={false}
                  />
                  {!!validation.phoneNumber && (
                    <Text style={styles.error}>{validation.phoneNumber}</Text>
                  )}
                </View>
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Input
                    text={meterNumber}
                    setText={setMeterNumber}
                    placeholder={"Meter Number"}
                    isPassword={false}
                  />
                  {!!validation.meterNumber && (
                    <Text style={styles.error}>{validation.meterNumber}</Text>
                  )}
                </View>
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={data}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select municipality"
                    value={value}
                    onChange={(item) => {
                      setValue(item.value);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={styles.icon}
                        color="black"
                        name="Safety"
                        size={20}
                      />
                    )}
                  />
                  {!!validation.municipality && (
                    <Text style={styles.error}>{validation.municipality}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Button title="Submit" onPress={handleAddBeneficiary} />
                </View>
                <View>
                  <Button title="Close" onPress={handleCloseModal} />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeader}>Buy Electricity</Text>
              <View style={styles.modalBody}>
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Input
                    text={cost}
                    setText={setCost}
                    placeholder={"Amount R"}
                    isPassword={false}
                  />
                  {!!validationCost && (
                    <Text style={styles.error}>{validationCost}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Button title="Submit" onPress={handleBuyElectricity} />
                </View>
                <View>
                  <Button title="Close" onPress={handleCloseModal} />
                </View>
              </View>
            </View>
          </View>
        )}
      </Modal>
      <TouchableHighlight
        style={styles.buttonContainer}
        onPress={() => {
          setModalVisible(true);
          setRecord(true);
          setBuyingElectricity(false);
        }}
      >
        <AntDesign name="pluscircle" size={50} color="#FF7043" />
      </TouchableHighlight>
      <Loader visible={loading} />
    </View>
  );
};

export default Benifiary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF2E0",
    padding: 20,
  },
  beneficiaryContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 25,
  },
  beneficiary: {
    flexDirection: "row",
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  buyingActionButton: {
    backgroundColor: "#FF7043",
    padding: 10,
    borderRadius: 8
  },
  buyingActionText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 14,
  },
  beneficiaryDetails: {
    flexDirection: "row",
  },
  beneficiaryIcon: {
    backgroundColor: "#FFF0EC",
    padding: 5,
    borderRadius: 10,
  },
  beneficiaryBody: {
    marginLeft: 20,
    marginTop: 5,
  },
  name: {
    fontSize: 18,
    color: "#5D4037",
  },
  phoneNumber: {
    fontSize: 14,
    marginTop: 15,
    color: "#8D7973",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  modalView: {
    backgroundColor: "white",
    height: 550,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "red",
  },
  modalHeader: {
    backgroundColor: "#FF7043",
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    padding: 10,
  },
  modalBody: {
    margin: 20,
  },
  dropdown: {
    marginBottom: 20,
    borderColor: "black",
    borderWidth: 1,
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  actions: {
    marginTop: 20,
    flexDirection: "row",
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    marginLeft: 10,
    fontSize: 14,
  },
  buttonActionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 20,
  }
});
