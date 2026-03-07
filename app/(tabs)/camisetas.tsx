import { Colors, Fonts, Universitario } from '@/constants/theme';
import camisetasData from '@/data/camisetas.json';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import {
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
const ANIOS_CON_DATOS = new Set(camisetasData.map((c) => c.anio));

const DECADAS = Array.from(
    new Set(TODOS_LOS_ANIOS.map((a) => Math.floor(a / 10) * 10))
).map((dec) => ({
    label: `${dec}s`,
    anios: TODOS_LOS_ANIOS.filter((a) => Math.floor(a / 10) * 10 === dec),
}));

const TIPO_COLOR: Record<string, { bg: string; text: string; label: string }> = {
    titular: { bg: Universitario.rojo, text: Universitario.crema, label: 'Titular' },
    alternativa: { bg: Universitario.negro, text: Universitario.crema, label: 'Alternativa' },
    tercera: { bg: Universitario.dorado, text: Universitario.negro, label: 'Tercera' },
};

export default function CamisetasScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const anioInicial = camisetasData.reduce((max, c) => Math.max(max, c.anio), 0);
    const [anioSeleccionado, setAnioSeleccionado] = useState(anioInicial);
    const [modalVisible, setModalVisible] = useState(false);

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
                {tieneDatos ? (
                    <View style={styles.camisetasContainer}>
                        {camisetasAnio.map((camiseta, idx) => {
                            const tipoInfo = TIPO_COLOR[camiseta.tipo] ?? TIPO_COLOR.titular;
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
                                <View key={idx} style={[styles.camisetaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    {/* Imagen / placeholder de colores */}
                                    {camiseta.imagen ? (
                                        <Image
                                            source={{ uri: camiseta.imagen }}
                                            style={styles.camisetaImagen}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <View style={styles.camisetaPlaceholder}>
                                            {/* Franjas diagonales con los colores de la camiseta */}
                                            <View style={[styles.franjaPlaceholder, { backgroundColor: color1 }]} />
                                            <View style={[styles.franjaPlaceholder, { backgroundColor: color2 }]} />
                                            <View style={styles.placeholderOverlay}>
                                                <Text style={styles.placeholderIcono}>👕</Text>
                                                <Text style={styles.placeholderAnio}>{camiseta.anio}</Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Info */}
                                    <View style={styles.camisetaInfo}>
                                        {/* Tipo + proveedor */}
                                        <View style={styles.camisetaTopRow}>
                                            <View style={[styles.tipoPill, { backgroundColor: tipoInfo.bg }]}>
                                                <Text style={[styles.tipoPillText, { color: tipoInfo.text }]}>
                                                    {tipoInfo.label}
                                                </Text>
                                            </View>
                                            <Text style={[styles.proveedorText, { color: colors.icon }]}>
                                                {camiseta.proveedor}
                                            </Text>
                                        </View>

                                        <Text style={[styles.descripcion, { color: colors.text }]}>
                                            {camiseta.descripcion}
                                        </Text>

                                        {/* Chips de colores */}
                                        <View style={styles.coloresRow}>
                                            {camiseta.colores.map((color, i) => {
                                                const dotColor =
                                                    color === 'Blanco' ? '#FFFFFF'
                                                        : color === 'Rojo' ? Universitario.rojo
                                                            : color === 'Negro' ? Universitario.negro
                                                                : Universitario.dorado;
                                                return (
                                                    <View key={i} style={styles.colorChip}>
                                                        <View
                                                            style={[
                                                                styles.colorDot,
                                                                {
                                                                    backgroundColor: dotColor,
                                                                    borderWidth: color === 'Blanco' ? 1 : 0,
                                                                    borderColor: '#DDD',
                                                                },
                                                            ]}
                                                        />
                                                        <Text style={[styles.colorLabel, { color: colors.text }]}>{color}</Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                </View>
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

    camisetasContainer: {
        paddingHorizontal: 20,
        gap: 20,
    },
    camisetaCard: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
    },

    // Imagen real
    camisetaImagen: {
        width: '100%',
        height: 220,
        backgroundColor: Universitario.grisClaro,
    },

    // Placeholder cuando no hay imagen
    camisetaPlaceholder: {
        width: '100%',
        height: 220,
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
    },
    franjaPlaceholder: {
        flex: 1,
    },
    placeholderOverlay: {
        position: 'absolute',
        inset: 0,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    placeholderIcono: {
        fontSize: 52,
    },
    placeholderAnio: {
        fontSize: 15,
        fontFamily: Fonts.black,
        color: 'rgba(0,0,0,0.35)',
        letterSpacing: 1,
    },

    camisetaInfo: {
        padding: 16,
        gap: 10,
    },
    camisetaTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tipoPill: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    tipoPillText: {
        fontSize: 11,
        fontFamily: Fonts.bold,
    },
    proveedorText: {
        fontSize: 12,
        fontFamily: Fonts.regular,
    },
    descripcion: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        lineHeight: 18,
    },
    coloresRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    colorChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    colorLabel: {
        fontSize: 11,
        fontFamily: Fonts.regular,
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
