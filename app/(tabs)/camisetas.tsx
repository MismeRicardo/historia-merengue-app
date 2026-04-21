import { API_BASE_URL } from '@/constants/api';
import { Colors, Fonts, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ANIO_INICIO = 1924;
const ANIO_FIN = 2026;
const TODOS_LOS_ANIOS = Array.from({ length: ANIO_FIN - ANIO_INICIO + 1 }, (_, i) => ANIO_INICIO + i);
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 2 columns with padding

const DECADAS = Array.from(
    new Set(TODOS_LOS_ANIOS.map((a) => Math.floor(a / 10) * 10))
).map((dec) => ({
    label: `${dec}s`,
    anios: TODOS_LOS_ANIOS.filter((a) => Math.floor(a / 10) * 10 === dec),
}));

function labelColor(tipo: string): { bg: string; text: string } {
    const t = tipo.toLowerCase();
    if (t.startsWith('alternativa')) return { bg: Universitario.negro, text: Universitario.crema };
    if (t.includes('tercera') || t.includes('copa')) return { bg: Universitario.dorado, text: Universitario.negro };
    return { bg: Universitario.rojo, text: Universitario.crema };
}

type Camiseta = {
    id: number;
    anio: number;
    proveedor: string;
    colores: string[];
    descripcion: string;
    tipo: string;
    principal: string | null;
    imagenes: string[];
};

type CamisetasTemporadaApi = {
    anio: number;
    camisetas: Array<{
        id: number;
        proveedor: string;
        colores: string[];
        descripcion: string;
        tipo: string;
        principal: string | null;
        imagenes: string[];
    }>;
};

export default function CamisetasScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const router = useRouter();
    const [camisetasData, setCamisetasData] = useState<Camiseta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [anioSeleccionado, setAnioSeleccionado] = useState(ANIO_FIN);
    const [modalVisible, setModalVisible] = useState(false);

    const cargarCamisetas = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/camisetas`);
            if (!res.ok) throw new Error(`Error ${res.status}`);

            const data = (await res.json()) as CamisetasTemporadaApi[];
            const flat = data.flatMap((t) =>
                t.camisetas.map((c) => ({
                    ...c,
                    anio: t.anio,
                }))
            );

            setCamisetasData(flat);

            const anioMasReciente = flat.reduce((max, c) => Math.max(max, c.anio), 0);
            if (anioMasReciente > 0) setAnioSeleccionado(anioMasReciente);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCamisetas();
    }, []);

    const ANIOS_CON_DATOS = useMemo(
        () => new Set(camisetasData.map((c) => c.anio)),
        [camisetasData]
    );

    const camisetasAnio = camisetasData.filter((c) => c.anio === anioSeleccionado);
    const tieneDatos = camisetasAnio.length > 0;

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
                    <Text style={styles.headerTitulo}>Camisetas Históricas</Text>
                    <Text style={styles.headerSubtitulo}>Indumentaria por temporada</Text>
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
                </View>

                {/* Contenido */}
                {loading ? (
                    <View style={styles.estadoContainer}>
                        <ActivityIndicator size="large" color={Universitario.rojo} />
                        <Text style={[styles.estadoTexto, { color: colors.icon }]}>Cargando camisetas...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.estadoContainer}>
                        <Text style={styles.sinDatosIcono}>⚠️</Text>
                        <Text style={[styles.sinDatosTitulo, { color: colors.text }]}>Sin conexión</Text>
                        <Text style={[styles.sinDatosSubtitulo, { color: Universitario.grisMedio }]}>No pudimos cargar las camisetas.</Text>
                        <TouchableOpacity style={styles.reintentarBtn} onPress={cargarCamisetas} activeOpacity={0.8}>
                            <Text style={styles.reintentarText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                ) : tieneDatos ? (
                    <View style={styles.grid}>
                        {camisetasAnio.map((camiseta, idx) => {
                            const { bg, text } = labelColor(camiseta.tipo);
                            const color1 =
                                camiseta.colores[0] === 'Blanco' ? '#FFFFFF'
                                    : camiseta.colores[0] === 'Rojo' ? Universitario.rojo
                                        : camiseta.colores[0] === 'Negro' ? Universitario.negro
                                            : Universitario.dorado;
                            const color2 = camiseta.colores[1]
                                ? camiseta.colores[1] === 'Blanco' ? '#FFFFFF'
                                    : camiseta.colores[1] === 'Rojo' ? Universitario.rojo
                                        : camiseta.colores[1] === 'Negro' ? Universitario.negro
                                            : Universitario.dorado
                                : color1;

                            return (
                                <TouchableOpacity
                                    key={idx}
                                    activeOpacity={0.85}
                                    onPress={() => router.push(`/camiseta/${camiseta.id}?anio=${camiseta.anio}` as any)}
                                >
                                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                        {/* Imagen o placeholder */}
                                        {camiseta.principal ? (
                                            <Image
                                                source={{ uri: camiseta.principal }}
                                                style={styles.cardImagen}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={styles.cardPlaceholder}>
                                                <View style={[styles.franja, { backgroundColor: color1 }]} />
                                                <View style={[styles.franja, { backgroundColor: color2 }]} />
                                                <View style={styles.placeholderOverlay}>
                                                    <Text style={styles.placeholderIcono}>👕</Text>
                                                </View>
                                            </View>
                                        )}

                                        {/* Etiqueta de tipo */}
                                        <View style={[styles.labelBar, { backgroundColor: bg }]}>
                                            <Text style={[styles.labelText, { color: text }]} numberOfLines={1}>
                                                {camiseta.tipo}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ) : (
                    <View style={styles.sinDatos}>
                        <Text style={styles.sinDatosIcono}>👕</Text>
                        <Text style={[styles.sinDatosTitulo, { color: colors.text }]}>Sin registros</Text>
                        <Text style={[styles.sinDatosSubtitulo, { color: Universitario.grisMedio }]}>
                            No tenemos datos de la camiseta de {anioSeleccionado}.{'\n'}
                            Probá con otro año.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal selector de año */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitulo, { color: colors.text }]}>Seleccionar Año</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.7}>
                                <Text style={[styles.modalCerrar, { color: Universitario.rojo }]}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={DECADAS}
                            keyExtractor={(item) => item.label}
                            contentContainerStyle={styles.modalLista}
                            renderItem={({ item: decada }) => (
                                <View style={styles.decadaBloque}>
                                    <Text style={[styles.decadaLabel, { color: Universitario.rojo }]}>
                                        {decada.label}
                                    </Text>
                                    <View style={styles.aniosGrid}>
                                        {decada.anios.map((anio) => {
                                            const tieneDatos = ANIOS_CON_DATOS.has(anio);
                                            const seleccionado = anio === anioSeleccionado;
                                            return (
                                                <TouchableOpacity
                                                    key={anio}
                                                    onPress={() => tieneDatos && seleccionarAnio(anio)}
                                                    activeOpacity={tieneDatos ? 0.7 : 1}
                                                    style={[
                                                        styles.anioBtn,
                                                        seleccionado && { backgroundColor: Universitario.rojo },
                                                        !tieneDatos && styles.anioBtnVacio,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.anioBtnText,
                                                            seleccionado && styles.anioBtnTextSeleccionado,
                                                            !tieneDatos && styles.anioBtnTextVacio,
                                                        ]}
                                                    >
                                                        {anio}
                                                    </Text>
                                                    {tieneDatos && !seleccionado && (
                                                        <View style={[styles.anioPunto, { backgroundColor: Universitario.rojo }]} />
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingBottom: 40 },

    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    headerTitulo: {
        fontSize: 26,
        fontFamily: Fonts.black,
        color: Universitario.crema,
    },
    headerSubtitulo: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: Universitario.crema,
        opacity: 0.8,
        marginTop: 2,
    },

    selectorRow: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    selectorBtn: {
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectorBtnAnio: {
        fontSize: 22,
        fontFamily: Fonts.black,
        color: Universitario.crema,
    },
    selectorBtnLabel: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: Universitario.crema,
        opacity: 0.8,
    },

    // Grid de 2 columnas
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 16,
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    cardImagen: {
        width: '100%',
        height: CARD_WIDTH * 1.1,
        backgroundColor: Universitario.grisClaro,
    },
    cardPlaceholder: {
        width: '100%',
        height: CARD_WIDTH * 1.1,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    franja: {
        flex: 1,
    },
    placeholderOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderIcono: {
        fontSize: 48,
    },
    labelBar: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    labelText: {
        fontSize: 12,
        fontFamily: Fonts.bold,
        letterSpacing: 0.3,
    },

    sinDatos: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
        gap: 10,
    },
    sinDatosIcono: {
        fontSize: 48,
    },
    sinDatosTitulo: {
        fontSize: 18,
        fontFamily: Fonts.bold,
    },
    sinDatosSubtitulo: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        lineHeight: 20,
    },
    estadoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        gap: 10,
    },
    estadoTexto: {
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    reintentarBtn: {
        marginTop: 6,
        backgroundColor: Universitario.rojo,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    reintentarText: {
        color: Universitario.crema,
        fontSize: 12,
        fontFamily: Fonts.bold,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    modalTitulo: {
        fontSize: 17,
        fontFamily: Fonts.bold,
    },
    modalCerrar: {
        fontSize: 15,
        fontFamily: Fonts.semiBold,
    },
    modalLista: {
        padding: 16,
        paddingBottom: 40,
    },
    decadaBloque: {
        marginBottom: 20,
    },
    decadaLabel: {
        fontSize: 13,
        fontFamily: Fonts.bold,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    aniosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    anioBtn: {
        width: 54,
        height: 36,
        borderRadius: 8,
        backgroundColor: Universitario.grisClaro,
        alignItems: 'center',
        justifyContent: 'center',
    },
    anioBtnVacio: {
        opacity: 0.3,
    },
    anioBtnText: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: Universitario.negro,
    },
    anioBtnTextSeleccionado: {
        color: Universitario.crema,
    },
    anioBtnTextVacio: {
        color: Universitario.grisMedio,
    },
    anioPunto: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
    },
});
