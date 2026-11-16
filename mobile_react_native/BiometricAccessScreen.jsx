import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';

// PALETA OFICIAL EJÉRCITO DEL PERÚ (EP)
const COLORS = {
  oliveDark: '#1E2215',    // Fondo principal táctico
  oliveDeep: '#2E331B',    // Verde camuflaje
  oliveBase: '#3B441F',    // Verde militar medio
  olivePrimary: '#4B5320', // Verde olivo militar reglamentario
  oliveLight: '#556B2F',   // Verde de autorización
  amber: '#DAA520',        // Dorado militar / Alertas
  tacticalGray: '#2B2B2B',
  redAlert: '#B71C1C',     // Alerta táctica DEFCON
  textLight: '#E5E7EB',
};

const { width } = Dimensions.get('window');

export default function BiometricAccessScreen() {
  const [activeTab, setActiveTab] = useState('facial'); // 'facial' | 'dactilar' | 'voz'
  const [scanState, setScanState] = useState('ESPERA'); // 'ESPERA' | 'ESCANEANDO' | 'VERIFICANDO' | 'AUTORIZADO' | 'DENEGADO'
  const [militaryProfile, setMilitaryProfile] = useState({
    cip: '318492010',
    dni: '45892104',
    grado: 'Coronel EP',
    gradoAbrev: 'CRL EP',
    arma: 'Infantería',
    apellidos: 'VÁSQUEZ HUAMÁN',
    nombres: 'Carlos Alberto',
    unidad: 'Comandancia General del Ejército (CGE)',
    destino: 'Cuartel General - Pabellón A',
    estado: 'AUTORIZADO',
    armaSerie: 'PIST-P226-EP-88412 (30 tiros)',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
  });

  const [voiceText, setVoiceText] = useState('');
  const [scanY] = useState(new Animated.Value(0));

  // Animación del Láser
  const startLaserAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, { toValue: 180, duration: 1500, useNativeDriver: true }),
        Animated.timing(scanY, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  };

  const simularEscaneoFacial = () => {
    setScanState('ESCANEANDO');
    startLaserAnimation();

    setTimeout(() => {
      setScanState('VERIFICANDO');
      setTimeout(() => {
        setScanState(militaryProfile.estado);
      }, 1200);
    }, 1500);
  };

  const simularVoz = (frase) => {
    setVoiceText(frase);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.oliveDeep} />

      {/* HEADER INSTITUCIONAL MILITAR */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.badgeEP}>
            <Text style={styles.badgeEPText}>EJÉRCITO DEL PERÚ</Text>
          </View>
          <Text style={styles.subHeader}>GARITA N° 01 • CUARTEL GENERAL</Text>
        </View>
        <Text style={styles.headerMainTitle}>CONTROL DE ACCESO Y PREVENCIÓN</Text>
      </View>

      {/* PESTAÑAS DE MÓDULOS */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'facial' && styles.tabActive]}
          onPress={() => setActiveTab('facial')}
        >
          <Text style={[styles.tabText, activeTab === 'facial' && styles.tabTextActive]}>
            1. FACIAL (CÁMARA)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'dactilar' && styles.tabActive]}
          onPress={() => setActiveTab('dactilar')}
        >
          <Text style={[styles.tabText, activeTab === 'dactilar' && styles.tabTextActive]}>
            2. DACTILAR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'voz' && styles.tabActive]}
          onPress={() => setActiveTab('voz')}
        >
          <Text style={[styles.tabText, activeTab === 'voz' && styles.tabTextActive]}>
            3. VOZ / VISITAS
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* MÓDULO 1: RECONOCIMIENTO FACIAL */}
        {activeTab === 'facial' && (
          <View style={styles.moduleCard}>
            <Text style={styles.moduleTitle}>[VISOR ÓPTICO CON RETÍCULA TÁCTICA]</Text>
            
            {/* Marco de Cámara con Retícula y Óvalo */}
            <View style={styles.cameraBox}>
              <Image source={{ uri: militaryProfile.foto }} style={styles.cameraImage} />
              
              {/* Óvalo Guía Militar */}
              <View style={styles.ovalGuide}>
                <Animated.View
                  style={[
                    styles.laserLine,
                    { transform: [{ translateY: scanY }] }
                  ]}
                />
              </View>

              <View style={styles.telemetryOverlay}>
                <Text style={styles.telemetryText}>LIVENESS CHECK: 98.5%</Text>
                <Text style={styles.telemetryText}>PUESTO: GARITA-01</Text>
              </View>
            </View>

            {/* Indicador de Estado en Tiempo Real */}
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>
                {scanState === 'ESPERA' && '[SISTEMA EN ESPERA - ENCUADRE ROSTRO]'}
                {scanState === 'ESCANEANDO' && '[ESCANEANDO ROSTRO Y PRUEBA DE VIDA...]'}
                {scanState === 'VERIFICANDO' && '[VERIFICANDO EN BASE DE DATOS EP (DITE)...]'}
                {scanState === 'AUTORIZADO' && '[ACCESO CONCEDIDO: IDENTIDAD VALIDADA]'}
                {scanState === 'DENEGADO' && '[ALERTA: ACCESO DENEGADO / IMPEDIMENTO]'}
              </Text>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={simularEscaneoFacial}>
              <Text style={styles.actionBtnText}>EJECUTAR ESCANEO FACIAL</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MÓDULO 2: RECONOCIMIENTO DACTILAR */}
        {activeTab === 'dactilar' && (
          <View style={styles.moduleCard}>
            <Text style={styles.moduleTitle}>[SENSOR DACTILAR BIOMÉTRICO (AFIS-EP)]</Text>
            <View style={styles.fingerprintBox}>
              <View style={styles.fingerprintGraphic}>
                <Text style={{ color: COLORS.oliveLight, fontSize: 36, textAlign: 'center' }}>☲☲</Text>
                <Text style={styles.fingerprintSubText}>SENSOR USB CONECTADO</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Huella', 'Huella verificada correctamente con la base de datos EP.')}>
              <Text style={styles.actionBtnText}>LEER HUELLA DACTILAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MÓDULO 3: VOZ Y VISITAS */}
        {activeTab === 'voz' && (
          <View style={styles.moduleCard}>
            <Text style={styles.moduleTitle}>[REGISTRO DE VISITAS POR COMANDO DE VOZ]</Text>
            
            <TouchableOpacity
              style={styles.voiceMicBtn}
              onPress={() => simularVoz('Dirigiéndose a la Comandancia de Educación y Doctrina - COEDE')}
            >
              <Text style={styles.voiceMicIcon}>🎙</Text>
              <Text style={styles.voiceMicLabel}>REGISTRAR DESTINO POR VOZ</Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>TRANSCRIPCIÓN Y CONFIRMACIÓN VISUAL:</Text>
            <TextInput
              style={styles.textInput}
              value={voiceText}
              onChangeText={setVoiceText}
              placeholder="Indique destino o dicte por voz..."
              placeholderTextColor="#777"
            />

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.oliveLight, marginTop: 8 }]}
              onPress={() => Alert.alert('Confirmación', `Destino confirmado: ${voiceText}`)}
            >
              <Text style={styles.actionBtnText}>CONFIRMAR REGISTRO POR VOZ</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ESTADOS Y ALERTAS: BANNER DE RESULTADO */}
        {scanState === 'AUTORIZADO' && (
          <View style={styles.cardAuth}>
            <View style={styles.bannerAuth}>
              <Text style={styles.bannerAuthText}>✓ ACCESO AUTORIZADO - EJÉRCITO DEL PERÚ</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileRank}>{militaryProfile.gradoAbrev} - {militaryProfile.arma.toUpperCase()}</Text>
              <Text style={styles.profileName}>{militaryProfile.apellidos}, {militaryProfile.nombres}</Text>
              <Text style={styles.profileInfo}>CIP: {militaryProfile.cip}  |  DNI: {militaryProfile.dni}</Text>
              <Text style={styles.profileInfo}>Unidad: {militaryProfile.unidad}</Text>
              <Text style={styles.profileInfo}>Destino: {militaryProfile.destino}</Text>
              <Text style={styles.profileInfo}>Armamento: {militaryProfile.armaSerie}</Text>
            </View>
          </View>
        )}

        {scanState === 'DENEGADO' && (
          <View style={styles.cardDenied}>
            <View style={styles.bannerDenied}>
              <Text style={styles.bannerDeniedText}>⚠ ACCESO DENEGADO / ALERTA TÁCTICA</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={[styles.profileName, { color: '#ff8a80' }]}>SIN AUTORIZACIÓN / RESTRICCIÓN DE INGRESO</Text>
              <Text style={styles.profileInfo}>Orden de impedimento por Inspectoría General del Ejército (IGE).</Text>
              <TouchableOpacity
                style={styles.alertGuardBtn}
                onPress={() => Alert.alert('Oficial de Guardia', 'Patrulla PM 501 despachada a Garita N° 1')}
              >
                <Text style={styles.alertGuardBtnText}>NOTIFICAR AL OFICIAL DE GUARDIA</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.oliveDark,
  },
  header: {
    backgroundColor: COLORS.oliveDeep,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.amber,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeEP: {
    backgroundColor: COLORS.olivePrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.amber,
  },
  badgeEPText: {
    color: COLORS.amber,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  subHeader: {
    color: '#aaa',
    fontSize: 9,
    fontFamily: 'monospace',
  },
  headerMainTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.oliveDeep,
    padding: 6,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: COLORS.tacticalGray,
  },
  tabActive: {
    backgroundColor: COLORS.olivePrimary,
    borderWidth: 1,
    borderColor: COLORS.amber,
  },
  tabText: {
    color: '#ccc',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  tabTextActive: {
    color: COLORS.amber,
  },
  scrollContent: {
    padding: 12,
    gap: 12,
  },
  moduleCard: {
    backgroundColor: '#171912',
    borderWidth: 1,
    borderColor: COLORS.oliveBase,
    borderRadius: 8,
    padding: 12,
  },
  moduleTitle: {
    color: COLORS.amber,
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cameraBox: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.olivePrimary,
  },
  cameraImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  ovalGuide: {
    position: 'absolute',
    width: 140,
    height: 180,
    borderWidth: 2,
    borderColor: '#4ade80',
    borderStyle: 'dashed',
    borderRadius: 70,
  },
  laserLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#DAA520',
  },
  telemetryOverlay: {
    position: 'absolute',
    top: 6,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  telemetryText: {
    color: '#4ade80',
    fontSize: 9,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  statusBox: {
    backgroundColor: COLORS.oliveDark,
    borderWidth: 1,
    borderColor: COLORS.oliveBase,
    padding: 8,
    borderRadius: 6,
    marginVertical: 10,
  },
  statusText: {
    color: COLORS.amber,
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionBtn: {
    backgroundColor: COLORS.olivePrimary,
    borderWidth: 1,
    borderColor: COLORS.amber,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  fingerprintBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  fingerprintGraphic: {
    width: 120,
    height: 140,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: COLORS.olivePrimary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintSubText: {
    color: '#888',
    fontSize: 8,
    marginTop: 6,
    fontFamily: 'monospace',
  },
  voiceMicBtn: {
    backgroundColor: COLORS.oliveDeep,
    borderWidth: 2,
    borderColor: COLORS.amber,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  voiceMicIcon: {
    fontSize: 28,
  },
  voiceMicLabel: {
    color: COLORS.amber,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 6,
  },
  inputLabel: {
    color: '#aaa',
    fontSize: 9,
    fontFamily: 'monospace',
    marginTop: 8,
  },
  textInput: {
    backgroundColor: COLORS.oliveDark,
    borderWidth: 1,
    borderColor: COLORS.oliveBase,
    color: '#fff',
    padding: 8,
    borderRadius: 6,
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  cardAuth: {
    backgroundColor: '#171912',
    borderWidth: 1.5,
    borderColor: COLORS.oliveLight,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerAuth: {
    backgroundColor: COLORS.oliveLight,
    padding: 8,
  },
  bannerAuthText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  cardDenied: {
    backgroundColor: '#171912',
    borderWidth: 2,
    borderColor: COLORS.redAlert,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerDenied: {
    backgroundColor: COLORS.redAlert,
    padding: 8,
  },
  bannerDeniedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  profileDetails: {
    padding: 10,
    gap: 3,
  },
  profileRank: {
    color: COLORS.amber,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  profileName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  profileInfo: {
    color: '#bbb',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  alertGuardBtn: {
    backgroundColor: COLORS.redAlert,
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  alertGuardBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});

