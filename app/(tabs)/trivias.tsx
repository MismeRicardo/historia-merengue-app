import { API_BASE_URL } from '@/constants/api';
import { Colors, Fonts, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TriviaRespuestaApi = {
    texto: string;
    correcta: boolean;
};

type TriviaApi = {
    id: number;
    pregunta: string;
    tema: string;
    imagen: string | null;
    respuestas: TriviaRespuestaApi[];
    created_at: string;
};

type Trivia = {
    id: number;
    pregunta: string;
    tema: string;
    imagen: string | null;
    opciones: string[];
    respuestaCorrecta: number;
};

export default function TriviasScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [preguntas, setPreguntas] = useState<Trivia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [indiceActual, setIndiceActual] = useState(0);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(null);
    const [puntaje, setPuntaje] = useState(0);
    const [finalizado, setFinalizado] = useState(false);

    useEffect(() => {
        let activo = true;

        const cargarPreguntas = async () => {
            setLoading(true);
            setError('');

            try {
                const res = await fetch(`${API_BASE_URL}/api/trivia`);
                if (!res.ok) {
                    throw new Error('No se pudieron cargar las preguntas');
                }

                const data = (await res.json()) as TriviaApi[];
                const normalizadas = Array.isArray(data)
                    ? data
                        .map((pregunta) => {
                            const respuestas = Array.isArray(pregunta.respuestas) ? pregunta.respuestas : [];
                            const respuestaCorrecta = respuestas.findIndex((respuesta) => respuesta.correcta);

                            return {
                                id: pregunta.id,
                                pregunta: pregunta.pregunta,
                                tema: pregunta.tema,
                                imagen: pregunta.imagen,
                                opciones: respuestas.map((respuesta) => respuesta.texto),
                                respuestaCorrecta,
                            };
                        })
                        .filter((pregunta) => pregunta.opciones.length >= 2 && pregunta.respuestaCorrecta >= 0)
                    : [];

                if (activo) {
                    setPreguntas(normalizadas);
                }
            } catch {
                if (activo) {
                    setError('No se pudieron cargar las preguntas de trivia');
                }
            } finally {
                if (activo) {
                    setLoading(false);
                }
            }
        };

        void cargarPreguntas();

        return () => {
            activo = false;
        };
    }, []);

    const triviaActual = preguntas[indiceActual];
    const total = preguntas.length;
    const progreso = useMemo(
        () => (total === 0 ? 0 : ((indiceActual + 1) / total) * 100),
        [indiceActual, total]
    );

    const seleccionarOpcion = (index: number) => {
        if (opcionSeleccionada !== null || finalizado || !triviaActual) return;
        setOpcionSeleccionada(index);

        if (index === triviaActual.respuestaCorrecta) {
            setPuntaje((prev) => prev + 1);
        }
    };

    const siguiente = () => {
        if (opcionSeleccionada === null || !triviaActual) return;

        const ultimo = indiceActual === total - 1;
        if (ultimo) {
            setFinalizado(true);
            return;
        }

        setIndiceActual((prev) => prev + 1);
        setOpcionSeleccionada(null);
    };

    const reiniciar = () => {
        setIndiceActual(0);
        setOpcionSeleccionada(null);
        setPuntaje(0);
        setFinalizado(false);
    };

    if (loading) {
        return (
            <View style={[styles.estadoContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={Universitario.rojo} />
                <Text style={[styles.estadoTexto, { color: colors.icon }]}>Cargando trivias...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.estadoContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.estadoTitulo, { color: colors.text }]}>Trivia</Text>
                <Text style={[styles.estadoTexto, { color: colors.icon, textAlign: 'center' }]}>{error}</Text>
            </View>
        );
    }

    if (total === 0) {
        return (
            <View style={[styles.estadoContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.estadoTitulo, { color: colors.text }]}>Trivia</Text>
                <Text style={[styles.estadoTexto, { color: colors.icon, textAlign: 'center' }]}>No hay preguntas cargadas todavía.</Text>
            </View>
        );
    }

    if (finalizado) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.resultadoCard, { backgroundColor: Universitario.blanco }]}>
                    <Text style={styles.resultadoEmoji}>🏆</Text>
                    <Text style={[styles.resultadoTitulo, { color: colors.text }]}>Trivia completada</Text>
                    <Text style={[styles.resultadoPuntaje, { color: Universitario.rojo }]}>
                        {puntaje} / {total}
                    </Text>
                    <Text style={[styles.resultadoTexto, { color: Universitario.grisMedio }]}>
                        {puntaje === total
                            ? 'Perfecto. Te sabes toda la historia crema.'
                            : puntaje >= Math.ceil(total * 0.6)
                                ? 'Muy bien. Buen nivel merengue.'
                                : 'Buen intento. Vuelve a jugar y sube tu puntaje.'}
                    </Text>

                    <TouchableOpacity style={styles.accionBtn} onPress={reiniciar} activeOpacity={0.8}>
                        <Text style={styles.accionBtnText}>Jugar otra vez</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            <View style={[styles.header, { backgroundColor: Universitario.rojo }]}>
                <Text style={styles.headerTitulo}>Trivias</Text>
                <Text style={styles.headerSubtitulo}>Preguntas y respuestas sobre la U</Text>
            </View>

            <View style={[styles.progresoCard, { backgroundColor: Universitario.blanco }]}>
                <View style={styles.progresoRow}>
                    <Text style={[styles.progresoLabel, { color: colors.text }]}>Pregunta {indiceActual + 1} de {total}</Text>
                    <Text style={[styles.progresoLabel, { color: Universitario.rojo }]}>Puntaje: {puntaje}</Text>
                </View>
                <View style={[styles.progresoTrack, { backgroundColor: Universitario.cremaOscuro }]}>
                    <View style={[styles.progresoFill, { width: `${progreso}%` as any, backgroundColor: Universitario.rojo }]} />
                </View>
            </View>

            <View style={[styles.triviaCard, { backgroundColor: Universitario.blanco }]}>
                {triviaActual.imagen && (
                    <View style={styles.imagenWrap}>
                        <Image
                            source={{ uri: triviaActual.imagen }}
                            style={styles.imagen}
                            resizeMode="cover"
                        />
                    </View>
                )}

                <View style={styles.temaPill}>
                    <Text style={styles.temaPillText}>{triviaActual.tema}</Text>
                </View>

                <Text style={[styles.pregunta, { color: colors.text }]}>{triviaActual.pregunta}</Text>

                <View style={styles.opcionesWrap}>
                    {triviaActual.opciones.map((opcion, index) => {
                        const selected = opcionSeleccionada === index;
                        const correcta = triviaActual.respuestaCorrecta === index;

                        const bgColor = opcionSeleccionada === null
                            ? Universitario.cremaOscuro
                            : correcta
                                ? '#DDF5E6'
                                : selected
                                    ? '#FCE4E4'
                                    : Universitario.cremaOscuro;

                        const borderColor = opcionSeleccionada === null
                            ? Universitario.cremaOscuro
                            : correcta
                                ? '#71C28B'
                                : selected
                                    ? '#E17676'
                                    : Universitario.cremaOscuro;

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => seleccionarOpcion(index)}
                                activeOpacity={0.85}
                                style={[styles.opcionBtn, { backgroundColor: bgColor, borderColor }]}
                            >
                                <Text style={[styles.opcionText, { color: colors.text }]}>{opcion}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[styles.accionBtn, opcionSeleccionada === null && styles.accionBtnDisabled]}
                    onPress={siguiente}
                    activeOpacity={0.8}
                    disabled={opcionSeleccionada === null}
                >
                    <Text style={styles.accionBtnText}>
                        {indiceActual === total - 1 ? 'Finalizar trivia' : 'Siguiente pregunta'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingBottom: 32 },
    estadoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    estadoTitulo: {
        fontSize: 22,
        fontFamily: Fonts.black,
        marginBottom: 8,
    },
    estadoTexto: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    header: {
        paddingTop: 56,
        paddingBottom: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerTitulo: {
        fontSize: 26,
        fontFamily: Fonts.black,
        color: Universitario.crema,
    },
    headerSubtitulo: {
        marginTop: 6,
        fontSize: 14,
        fontFamily: Fonts.medium,
        color: Universitario.cremaOscuro,
    },
    progresoCard: {
        marginTop: 14,
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    progresoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    progresoLabel: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
    },
    progresoTrack: {
        height: 8,
        borderRadius: 99,
        overflow: 'hidden',
    },
    progresoFill: {
        height: 8,
        borderRadius: 99,
    },
    triviaCard: {
        marginTop: 12,
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    imagenWrap: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: '#F6F2E8',
    },
    imagen: {
        width: '100%',
        height: 180,
    },
    temaPill: {
        alignSelf: 'flex-start',
        backgroundColor: '#F4E7D0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        marginBottom: 10,
    },
    temaPillText: {
        fontSize: 11,
        fontFamily: Fonts.semiBold,
        color: Universitario.rojo,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    pregunta: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        lineHeight: 24,
        marginBottom: 14,
    },
    opcionesWrap: {
        gap: 10,
    },
    opcionBtn: {
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    opcionText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    explicacionBox: {
        marginTop: 14,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#FFFDF6',
    },
    explicacionTitulo: {
        fontSize: 13,
        fontFamily: Fonts.bold,
        marginBottom: 4,
    },
    explicacionTexto: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        lineHeight: 18,
    },
    accionBtn: {
        marginTop: 16,
        backgroundColor: Universitario.rojo,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    accionBtnDisabled: {
        opacity: 0.45,
    },
    accionBtnText: {
        color: Universitario.blanco,
        fontSize: 14,
        fontFamily: Fonts.bold,
    },
    resultadoCard: {
        marginHorizontal: 16,
        marginTop: 80,
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    resultadoEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    resultadoTitulo: {
        fontSize: 22,
        fontFamily: Fonts.black,
    },
    resultadoPuntaje: {
        marginTop: 8,
        fontSize: 30,
        fontFamily: Fonts.black,
    },
    resultadoTexto: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: Fonts.medium,
        textAlign: 'center',
        lineHeight: 20,
    },
});