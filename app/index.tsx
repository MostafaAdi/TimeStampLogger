import useToggle from "@/hooks/useToggle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

type Log = {
  label: string;
  timestamp: string;
};

const RoundButton = ({ onPress, title }: { onPress: () => void; title: string }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const TimestampLogger: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isEntry, toggle] = useToggle('status', false);

  // Load logs and onSite status from AsyncStorage when the app starts
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem('logs');
        if (storedLogs) {
          setLogs(JSON.parse(storedLogs));
        }
      } catch (error) {
        console.error('Failed to load logs from storage', error);
      }
    };

    loadLogs();
  }, []);

  // Save logs to AsyncStorage whenever logs change
  useEffect(() => {
    const saveLogs = async () => {
      try {
        await AsyncStorage.setItem('logs', JSON.stringify(logs));
      } catch (error) {
        console.error('Failed to save logs to storage', error);
      }
    };
    saveLogs();
  }, [logs]);


  const addTimestamp = (label: string) => {
    const date = new Date();
    
    const dateTime24Hour = date.toLocaleString('en-GB', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });

    const newLog: Log = {
      label,
      timestamp: dateTime24Hour
    };
    setLogs((prevLogs) => [...prevLogs, newLog]);
    toggle();
  };

  const deleteTimestamp = (index: number) => {
    const updatedLogs = logs.filter((_, i) => i !== index);
    setLogs(updatedLogs);
  }
  return (
    <View style={styles.container}>
      
      <View style={styles.buttonContainer}>
        <Text style={styles.title}>Timestamp Logger</Text>
        {
          isEntry 
            ? <RoundButton  title="Log Entry" onPress={() => addTimestamp("Entry")} />
            : <RoundButton  title="Log Exit" onPress={() => addTimestamp("Exit")} />
        }
      </View>
      
      <FlatList
        data={logs}
        keyExtractor={(_, index) => index.toString()}
        style={styles.list}
        renderItem={({ item, index }) => {
          return (
            <View
              style={
                item.label === "Entry" ? styles.logItemRed : styles.logItemGreen
              }
            >
              <View>
                <Text>{item.label}</Text>
                <Text>{item.timestamp}</Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteTimestamp(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText} >❌</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  logItemRed: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor:"red",
    borderColor: "#ddd",
  },
  logItemGreen: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor:"green",
    borderColor: "#ddd",
  },
  button: {
    width: 200, // Button width
    height: 200, // Button height (equal to width for a perfect circle)
    borderRadius: 100, // Half of width or height to make it round
    backgroundColor: '#007AFF', // Background color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5, // Shadow for Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: "center"
  },
  list: {
    margin: 30
  },
  deleteButton: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    padding: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});

export default TimestampLogger;
