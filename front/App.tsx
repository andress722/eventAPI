
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const Stack = createNativeStackNavigator();
const api = axios.create({ baseURL: 'http://localhost:3000/' });

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get('/events');
        setEvents(res.data.events);
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível buscar os eventos.');
      }
    }
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Disponíveis</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => navigation.navigate('Detalhes', { event: item })}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.email}>{item.slug}</Text>
          </Pressable>
        )}
      />
      <Button title="Cadastrar Novo Evento" onPress={() => navigation.navigate('Cadastrar')} />
    </View>
  );
};

const EventDetailScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    try {
      await api.post(`/events/${event.id}/attendees`, { name, email });
      Alert.alert('Sucesso', 'Inscrição realizada!');
      setName('');
      setEmail('');
    } catch {
      Alert.alert('Erro', 'Erro ao se inscrever.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text>Slug: {event.slug}</Text>
      <Text>Detalhes: {event.detail || 'Sem detalhes'}</Text>
      <Text>Máx. Participantes: {event.maxAttendees || 'Ilimitado'}</Text>

      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Button title="Inscrever" onPress={handleRegister} />
      <View style={{ marginTop: 20 }}>
        <Button title="Ver Participantes" onPress={() => navigation.navigate('Participantes', { eventId: event.id })} />
      </View>
    </View>
  );
};

const CreateEventScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [detail, setDetail] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/events', {
        title,
        slug,
        detail,
        maxAttendees: maxAttendees ? Number(maxAttendees) : undefined,
      });
      Alert.alert('Sucesso', 'Evento cadastrado!');
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Erro ao cadastrar evento.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Evento</Text>
      <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Slug" value={slug} onChangeText={setSlug} />
      <TextInput style={styles.input} placeholder="Detalhes" value={detail} onChangeText={setDetail} />
      <TextInput style={styles.input} placeholder="Máx. Participantes" value={maxAttendees} onChangeText={setMaxAttendees} keyboardType="numeric" />
      <Button title="Cadastrar" onPress={handleSubmit} />
    </View>
  );
};

const AttendeeListScreen = ({ route }) => {
  const { eventId } = route.params;
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    async function fetchAttendees() {
      try {
        const res = await api.get(`/attendees/${eventId}/attendees`);
        setAttendees(res.data.attendee);
      } catch {
        Alert.alert('Erro', 'Erro ao buscar participantes.');
      }
    }
    fetchAttendees();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participantes</Text>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.email}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Eventos" component={EventListScreen} />
        <Stack.Screen name="Detalhes" component={EventDetailScreen} />
        <Stack.Screen name="Cadastrar" component={CreateEventScreen} />
        <Stack.Screen name="Participantes" component={AttendeeListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: { marginBottom: 16, padding: 16, borderRadius: 10, backgroundColor: '#f0f0f0' },
  name: { fontSize: 18, fontWeight: '500' },
  email: { fontSize: 14, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 16 },
});
