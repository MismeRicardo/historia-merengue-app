import { Colors, Fonts, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Trivia = {
    id: number;
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: number;
    explicacion: string;
};

const TRIVIAS: Trivia[] = [
    {
        id: 1,
        pregunta: 'En que anio se fundo Universitario de Deportes?',
        opciones: ['1911', '1924', '1930', '1942'],
        respuestaCorrecta: 1,
        explicacion: 'La U fue fundada el 7 de agosto de 1924 en Lima.',
    },
    {
        id: 2,
        pregunta: 'Como se llama el estadio principal de Universitario?',
        opciones: ['Nacional', 'Alejandro Villanueva', 'Monumental', 'San Marcos'],
        respuestaCorrecta: 2,
        explicacion: 'El Estadio Monumental es la casa principal de la U.',
    },
    {
        id: 3,
        pregunta: 'Que color identifica historicamente la camiseta de la U?',
        opciones: ['Azul', 'Rojo', 'Crema', 'Verde'],
        respuestaCorrecta: 2,
        explicacion: 'El color crema es parte central de la identidad del club.',
    },
    {
        id: 4,
        pregunta: 'Cual es el apodo historico del club?',
        opciones: ['Blanquiazules', 'Rojinegros', 'Merengues', 'Celestes'],
        respuestaCorrecta: 2,
        explicacion: 'Universitario es conocido popularmente como los Merengues.',
    },
    {
        id: 5,
        pregunta: 'Quien es uno de los maximos idolos goleadores de la U?',
        opciones: ['Teodoro Lolo Fernandez', 'Cesar Cueto', 'Claudio Pizarro', 'Nolberto Solano'],
        respuestaCorrecta: 0,
        explicacion: 'Lolo Fernandez es una leyenda absoluta del club.',
    },
];

export default function TriviasScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [indiceActual, setIndiceActual] = useState(0);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(null);
    const [puntaje, setPuntaje] = useState(0);
    const [finalizado, setFinalizado] = useState(false);

    const triviaActual = TRIVIAS[indiceActual];
    const total = TRIVIAS.length;
    const progreso = useMemo(() => ((indiceActual + 1) / total) * 100, [indiceActual, total]);

    const seleccionarOpcion = (index: number) => {
        if (opcionSeleccionada !== null || finalizado) return;
        setOpcionSeleccionada(index);
        if (index === triviaActual.respuestaCorrecta) {
            setPuntaje((prev) => prev + 1);
        }
    };

    const siguiente = () => {
        if (opcionSeleccionada === null) return;

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

                {opcionSeleccionada !== null && (
                    <View style={[styles.explicacionBox, { borderColor: colors.border }]}> 
                        <Text style={[styles.explicacionTitulo, { color: colors.text }]}>Respuesta:</Text>
                        <Text style={[styles.explicacionTexto, { color: Universitario.grisMedio }]}>{triviaActual.explicacion}</Text>
                    </View>
                )}

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