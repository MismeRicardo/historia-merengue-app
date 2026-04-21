import { API_BASE_URL } from '@/constants/api';
import { Colors, Fonts, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

const COLOR_MAP: Record<string, string> = {
    Blanco: '#FFFFFF',
    Rojo: Universitario.rojo,
    Negro: Universitario.negro,
    Dorado: Universitario.dorado,
    Azul: '#1D4ED8',
    Verde: '#15803D',
};

function labelColor(tipo: string): { bg: string; text: string } {
    const t = tipo.toLowerCase();
    if (t.startsWith('alternativa')) return { bg: Universitario.negro, text: Universitario.crema };
    if (t.includes('tercera') || t.includes('copa')) return { bg: Universitario.dorado, text: Universitario.negro };
    return { bg: Universitario.rojo, text: Universitario.crema };
}

export default function CamisetaDetailScreen() {
    const { id, anio } = useLocalSearchParams<{ id: string; anio?: string }>();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [fotoActiva, setFotoActiva] = useState(0);
    const carouselRef = useRef<ScrollView>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [camiseta, setCamiseta] = useState<{
        id: number;
        anio: number;
        proveedor: string;
        colores: string[];
        descripcion: string;
        tipo: string;
        principal: string | null;
        imagenes: string[];
    } | null>(null);

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE_URL}/api/camisetas`);
                if (!res.ok) throw new Error(`Error ${res.status}`);

                const data = (await res.json()) as Array<{
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
                }>;

                const idNum = Number(id);
                const anioNum = anio ? Number(anio) : null;

                const flat = data.flatMap((t) => t.camisetas.map((c) => ({ ...c, anio: t.anio })));
                const found = flat.find((c) => c.id === idNum && (anioNum === null || c.anio === anioNum)) ?? null;
                setCamiseta(found);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        cargar();
    }, [id, anio]);

    const imagenes = camiseta?.imagenes ?? [];

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        setFotoActiva(idx);
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.notFound}>
                    <ActivityIndicator size="large" color={Universitario.rojo} />
                    <Text style={[styles.notFoundText, { color: colors.text }]}>Cargando camiseta...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !camiseta) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={[styles.backText, { color: Universitario.rojo }]}>← Volver</Text>
                </TouchableOpacity>
                <View style={styles.notFound}>
                    <Text style={styles.notFoundEmoji}>👕</Text>
                    <Text style={[styles.notFoundText, { color: colors.text }]}>
                        {error ? 'No se pudo cargar la camiseta' : 'Camiseta no encontrada'}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const { bg, text: labelText } = labelColor(camiseta.tipo);
    const color1 = COLOR_MAP[camiseta.colores[0]] ?? Universitario.rojo;
    const color2 = camiseta.colores[1] ? (COLOR_MAP[camiseta.colores[1]] ?? color1) : color1;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Botón cerrar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
                    <Text style={[styles.backText, { color: Universitario.rojo }]}>✕ Cerrar</Text>
                </TouchableOpacity>
                <View style={[styles.tipoBadge, { backgroundColor: bg }]}>
                    <Text style={[styles.tipoBadgeText, { color: labelText }]}>{camiseta.tipo}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Carrusel de imágenes */}
                <View>
                    {imagenes.length > 0 ? (
                        <>
                            <ScrollView
                                ref={carouselRef}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={onScroll}
                                scrollEventThrottle={16}
                            >
                                {imagenes.map((uri, i) => (
                                    <Image
                                        key={i}
                                        source={{ uri }}
                                        style={styles.imagen}
                                        resizeMode="cover"
                                    />
                                ))}
                            </ScrollView>
                            {/* Indicadores de puntos */}
                            {imagenes.length > 1 && (
                                <View style={styles.dotsRow}>
                                    {imagenes.map((_, i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.dot,
                                                i === fotoActiva
                                                    ? { backgroundColor: Universitario.rojo, width: 18 }
                                                    : { backgroundColor: Universitario.grisMedio, opacity: 0.4 },
                                            ]}
                                        />
                                    ))}
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={styles.placeholder}>
                            <View style={[styles.franjaPlaceholder, { backgroundColor: color1 }]} />
                            <View style={[styles.franjaPlaceholder, { backgroundColor: color2 }]} />
                            <View style={styles.placeholderOverlay}>
                                <Text style={styles.placeholderIcono}>👕</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Detalle */}
                <View style={styles.detalle}>
                    {/* Año */}
                    <View style={styles.anioRow}>
                        <Text style={[styles.anio, { color: colors.text }]}>{camiseta.anio}</Text>
                        <Text style={[styles.temporadaLabel, { color: Universitario.grisMedio }]}>Temporada</Text>
                    </View>

                    {/* Proveedor */}
                    <View style={[styles.filaDetalle, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.filaLabel, { color: Universitario.grisMedio }]}>Proveedor</Text>
                        <Text style={[styles.filaValor, { color: colors.text }]}>{camiseta.proveedor}</Text>
                    </View>

                    {/* Colores */}
                    <View style={[styles.filaDetalle, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.filaLabel, { color: Universitario.grisMedio }]}>Colores</Text>
                        <View style={styles.coloresRow}>
                            {camiseta.colores.map((color, i) => {
                                const dotColor = COLOR_MAP[color] ?? Universitario.grisMedio;
                                return (
                                    <View key={i} style={styles.colorChip}>
                                        <View
                                            style={[
                                                styles.colorDot,
                                                {
                                                    backgroundColor: dotColor,
                                                    borderWidth: color === 'Blanco' ? 1 : 0,
                                                    borderColor: '#CCC',
                                                },
                                            ]}
                                        />
                                        <Text style={[styles.colorNombre, { color: colors.text }]}>{color}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Descripción */}
                    <View style={styles.descripcionBloque}>
                        <Text style={[styles.descripcionLabel, { color: Universitario.grisMedio }]}>Descripción</Text>
                        <Text style={[styles.descripcionTexto, { color: colors.text }]}>
                            {camiseta.descripcion}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    backBtn: {
        paddingVertical: 4,
        paddingHorizontal: 2,
    },
    backText: {
        fontSize: 15,
        fontFamily: Fonts.semiBold,
    },
    tipoBadge: {
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
    tipoBadgeText: {
        fontSize: 13,
        fontFamily: Fonts.bold,
    },

    scroll: {
        paddingBottom: 48,
    },

    // Imagen
    imagen: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 1.1,
        backgroundColor: Universitario.grisClaro,
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        paddingBottom: 4,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        width: 6,
    },
    placeholder: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 1.1,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    franjaPlaceholder: { flex: 1 },
    placeholderOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderIcono: { fontSize: 80 },

    // Detalle
    detalle: {
        paddingHorizontal: 24,
        paddingTop: 24,
        gap: 0,
    },
    anioRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10,
        marginBottom: 24,
    },
    anio: {
        fontSize: 52,
        fontFamily: Fonts.black,
        lineHeight: 56,
    },
    temporadaLabel: {
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    filaDetalle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    filaLabel: {
        fontSize: 13,
        fontFamily: Fonts.regular,
    },
    filaValor: {
        fontSize: 14,
        fontFamily: Fonts.semiBold,
    },
    coloresRow: {
        flexDirection: 'row',
        gap: 12,
    },
    colorChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    colorDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    colorNombre: {
        fontSize: 13,
        fontFamily: Fonts.semiBold,
    },
    descripcionBloque: {
        paddingTop: 20,
        gap: 8,
    },
    descripcionLabel: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        marginBottom: 4,
    },
    descripcionTexto: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        lineHeight: 24,
    },

    // Error
    notFound: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    notFoundEmoji: { fontSize: 48 },
    notFoundText: { fontSize: 18, fontFamily: Fonts.bold },
});
