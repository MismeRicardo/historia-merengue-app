import { Colors, Fonts, Universitario } from '@/constants/theme';
import plantelData from '@/data/plantel.json';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const POSICIONES: Record<string, string> = {
    Portero: '🧤',
    Defensa: '🛡️',
    Mediocampista: '⚙️',
    Extremo: '⚡',
    Delantero: '⚽',
};

const ANIO_INICIO = 1928;
const ANIO_FIN = 2026;
const TODOS_LOS_ANIOS = Array.from({ length: ANIO_FIN - ANIO_INICIO + 1 }, (_, i) => ANIO_INICIO + i);
const ANIOS_CON_DATOS = new Set(plantelData.map((p) => p.anio));

// Agrupar por décadas
const DECADAS = Array.from(
    new Set(TODOS_LOS_ANIOS.map((a) => Math.floor(a / 10) * 10))
).map((dec) => ({
    label: `${dec}s`,
    anios: TODOS_LOS_ANIOS.filter((a) => Math.floor(a / 10) * 10 === dec),
}));

export default function PlantelScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [anioSeleccionado, setAnioSeleccionado] = useState(plantelData[0].anio);
    const [modalVisible, setModalVisible] = useState(false);

    const plantelActual = plantelData.find((p) => p.anio === anioSeleccionado) ?? null;

    const seleccionarAnio = (anio: number) => {
        setAnioSeleccionado(anio);
        setModalVisible(false);
    };

    return (
        <>
            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
            >
                {/* Encabezado */}
                <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
                    <Text style={styles.headerTitulo}>Planteles Históricos</Text>
                    <Text style={styles.headerSubtitulo}>Jugadores por temporada</Text>
                </View>

                {/* Botón selector */}
                <View style={styles.selectorRow}>
                    <TouchableOpacity
                        style={[styles.selectorBtn, { backgroundColor: Universitario.rojo }]}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.selectorBtnAnio}>{anioSeleccionado}</Text>
                        <Text style={styles.selectorBtnLabel}>▼ Cambiar temporada</Text>
                    </TouchableOpacity>
                    {plantelActual?.campeon && (
                        <View style={[styles.campeonPill, { backgroundColor: Universitario.dorado }]}>
                            <Text style={styles.campeonPillText}>🏆 Campeón</Text>
                        </View>
                    )}
                </View>

                {plantelActual ? (
                    <>
                        {/* Info del DT */}
                        <View style={[styles.dtCard, { backgroundColor: Universitario.blanco, borderLeftColor: Universitario.rojo }]}>
                            <Text style={[styles.dtLabel, { color: colors.icon }]}>Director Técnico</Text>
                            <Text style={[styles.dtNombre, { color: colors.text }]}>{plantelActual.dt}</Text>
                        </View>

                        {/* Goleador */}
                        <View style={[styles.goleadorCard, { backgroundColor: Universitario.rojo }]}>
                            <Text style={styles.goleadorLabel}>⚽ Goleador de la temporada</Text>
                            <Text style={styles.goleadorNombre}>{plantelActual.goleador}</Text>
                        </View>

                        {/* Lista de jugadores */}
                        <Text style={[styles.seccionLabel, { color: colors.text }]}>Jugadores ({plantelActual.jugadores.length})</Text>
                        {plantelActual.jugadores.map((j) => (
                            <View key={j.id} style={[styles.jugadorCard, { backgroundColor: Universitario.blanco }]}>
                                <View style={[styles.numero, { backgroundColor: Universitario.rojo }]}>
                                    <Text style={styles.numeroText}>{j.numero}</Text>
                                </View>
                                <View style={styles.jugadorInfo}>
                                    <Text style={[styles.jugadorNombre, { color: colors.text }]}>{j.nombre}</Text>
                                    <Text style={[styles.jugadorPos, { color: colors.icon }]}>
                                        {POSICIONES[j.posicion] ?? '👤'} {j.posicion}
                                    </Text>
                                </View>
                                <View style={[styles.bandera, { backgroundColor: Universitario.cremaOscuro }]}>
                                    <Text style={[styles.banderaText, { color: colors.icon }]}>{j.nacionalidad}</Text>
                                </View>
                            </View>
                        ))}
                    </>
                ) : (
                    <View style={styles.sinDatos}>
                        <Text style={styles.sinDatosEmoji}>📂</Text>
                        <Text style={[styles.sinDatosTitulo, { color: colors.text }]}>Sin datos disponibles</Text>
                        <Text style={[styles.sinDatosDesc, { color: colors.icon }]}>
                            No tenemos el plantel registrado para {anioSeleccionado}.{'\n'}
                            Prueba una temporada con el ícono 🏆 o datos recientes.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal selector de temporada */}
            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    {/* Header del modal */}
                    <View style={[styles.modalHeader, { borderBottomColor: Universitario.cremaOscuro }]}>
                        <Text style={[styles.modalTitulo, { color: colors.text }]}>Seleccionar Temporada</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cerrarBtn}>
                            <Text style={[styles.cerrarText, { color: Universitario.rojo }]}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Leyenda */}
                    <View style={styles.leyenda}>
                        <View style={[styles.leyendaDot, { backgroundColor: Universitario.rojo }]} />
                        <Text style={[styles.leyendaText, { color: colors.icon }]}>Con datos disponibles</Text>
                        <View style={[styles.leyendaDot, { backgroundColor: Universitario.cremaOscuro, marginLeft: 12 }]} />
                        <Text style={[styles.leyendaText, { color: colors.icon }]}>Sin datos</Text>
                    </View>

                    <FlatList
                        data={DECADAS}
                        keyExtractor={(item) => item.label}
                        contentContainerStyle={styles.modalContent}
                        renderItem={({ item: decada }) => (
                            <View style={styles.decadaBloque}>
                                <Text style={[styles.decadaLabel, { color: Universitario.rojo }]}>{decada.label}</Text>
                                <View style={styles.aniosGrid}>
                                    {decada.anios.map((anio) => {
                                        const tieneDatos = ANIOS_CON_DATOS.has(anio);
                                        const estaActivo = anio === anioSeleccionado;
                                        return (
                                            <TouchableOpacity
                                                key={anio}
                                                onPress={() => seleccionarAnio(anio)}
                                                style={[
                                                    styles.anioCelda,
                                                    {
                                                        backgroundColor: estaActivo
                                                            ? Universitario.rojo
                                                            : tieneDatos
                                                                ? Universitario.cremaOscuro
                                                                : 'transparent',
                                                        borderColor: tieneDatos ? Universitario.rojo : Universitario.cremaOscuro,
                                                    },
                                                ]}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[
                                                    styles.anioCeldaText,
                                                    {
                                                        color: estaActivo
                                                            ? Universitario.blanco
                                                            : tieneDatos
                                                                ? Universitario.rojo
                                                                : colors.icon,
                                                        fontFamily: tieneDatos ? Fonts.bold : Fonts.regular,
                                                    },
                                                ]}>
                                                    {anio}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )}
                    />
                </SafeAreaView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingBottom: 40 },
    header: {
        paddingTop: 56,
        paddingBottom: 28,
        paddingHorizontal: 20,
    },
    headerTitulo: {
        fontSize: 28,
        fontFamily: Fonts.black,
        color: Universitario.crema,
        marginBottom: 4,
    },
    headerSubtitulo: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        color: Universitario.cremaOscuro,
        opacity: 0.9,
    },
    // Botón selector
    selectorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        gap: 12,
    },
    selectorBtn: {
        flex: 1,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
    },
    selectorBtnAnio: {
        fontSize: 26,
        fontFamily: Fonts.black,
        color: Universitario.crema,
        lineHeight: 30,
    },
    selectorBtnLabel: {
        fontSize: 12,
        fontFamily: Fonts.medium,
        color: Universitario.cremaOscuro,
        opacity: 0.9,
    },
    campeonPill: {
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    campeonPillText: {
        fontSize: 13,
        fontFamily: Fonts.bold,
        color: Universitario.negro,
    },
    // Cards
    seccionLabel: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
    },
    dtCard: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 14,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    dtLabel: { fontSize: 12, fontFamily: Fonts.regular, marginBottom: 4 },
    dtNombre: { fontSize: 18, fontFamily: Fonts.bold },
    goleadorCard: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 14,
        padding: 16,
    },
    goleadorLabel: { fontSize: 12, fontFamily: Fonts.medium, color: Universitario.cremaOscuro, marginBottom: 4 },
    goleadorNombre: { fontSize: 18, fontFamily: Fonts.bold, color: Universitario.crema },
    jugadorCard: {
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    numero: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    numeroText: { fontSize: 14, fontFamily: Fonts.black, color: Universitario.crema },
    jugadorInfo: { flex: 1 },
    jugadorNombre: { fontSize: 15, fontFamily: Fonts.semiBold, marginBottom: 2 },
    jugadorPos: { fontSize: 12, fontFamily: Fonts.regular },
    bandera: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    banderaText: { fontSize: 11, fontWeight: '500' },
    // Sin datos
    sinDatos: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
        gap: 8,
    },
    sinDatosEmoji: { fontSize: 48 },
    sinDatosTitulo: { fontSize: 18, fontFamily: Fonts.bold, textAlign: 'center' },
    sinDatosDesc: { fontSize: 13, fontFamily: Fonts.regular, textAlign: 'center', lineHeight: 20, marginTop: 4 },
    // Modal
    modalContainer: { flex: 1 },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    modalTitulo: { fontSize: 18, fontFamily: Fonts.bold },
    cerrarBtn: { paddingVertical: 4, paddingHorizontal: 8 },
    cerrarText: { fontSize: 15, fontFamily: Fonts.semiBold },
    leyenda: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 6,
    },
    leyendaDot: { width: 10, height: 10, borderRadius: 5 },
    leyendaText: { fontSize: 12, fontFamily: Fonts.regular },
    modalContent: { paddingHorizontal: 16, paddingBottom: 32 },
    decadaBloque: { marginBottom: 20 },
    decadaLabel: {
        fontSize: 14,
        fontFamily: Fonts.black,
        letterSpacing: 1,
        marginBottom: 8,
    },
    aniosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    anioCelda: {
        width: 60,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
    },
    anioCeldaText: { fontSize: 13 },
});
