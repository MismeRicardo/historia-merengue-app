import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, Universitario } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BadgeType = { label: string; color: string };

type MenuItem = {
    label: string;
    href: string;
    icono: 'clock.fill' | 'person.3.fill' | 'star.fill' | 'info.circle.fill' | 'sportscourt.fill' | 'calendar' | 'magnifyingglass';
    badge?: BadgeType;
};

const MENU_ITEMS: MenuItem[] = [
    {
        label: 'Historia',
        href: '/(tabs)/historia',
        icono: 'clock.fill',
    },
    {
        label: 'Plantel',
        href: '/(tabs)/plantel',
        icono: 'person.3.fill',
    },
    {
        label: 'Goleadores',
        href: '/(tabs)/goleadores',
        icono: 'sportscourt.fill',
    },
];

type Props = {
    visible: boolean;
    onClose: () => void;
};

export function MasMenu({ visible, onClose }: Props) {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleNavigate = (href: string) => {
        onClose();
        router.push(href as any);
    };

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.headerTitulo, { color: colors.text }]}>Más</Text>
                    <TouchableOpacity onPress={onClose} style={styles.cerrarBtn} activeOpacity={0.7}>
                        <Text style={[styles.cerrarText, { color: Universitario.rojo }]}>Cerrar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.lista}
                    showsVerticalScrollIndicator={false}
                >
                    {MENU_ITEMS.map((item, index) => {
                        const esUltimo = index === MENU_ITEMS.length - 1;
                        return (
                            <TouchableOpacity
                                key={item.href}
                                style={[
                                    styles.item,
                                    { borderBottomColor: colors.border },
                                    esUltimo && styles.itemUltimo,
                                ]}
                                onPress={() => handleNavigate(item.href)}
                                activeOpacity={0.6}
                            >
                                {/* Icono */}
                                <View style={[styles.iconoWrapper, { backgroundColor: colors.card }]}>
                                    <IconSymbol name={item.icono} size={22} color={Universitario.rojo} />
                                </View>

                                {/* Label */}
                                <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>

                                {/* Badge opcional */}
                                {item.badge && (
                                    <View style={[styles.badge, { backgroundColor: item.badge.color }]}>
                                        <Text style={styles.badgeText}>{item.badge.label}</Text>
                                    </View>
                                )}

                                {/* Chevron */}
                                <IconSymbol name="chevron.right" size={16} color={colors.icon} style={styles.chevron} />
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerTitulo: {
        fontSize: 22,
        fontFamily: Fonts.black,
    },
    cerrarBtn: {
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    cerrarText: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
    },
    lista: {
        paddingTop: 8,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 16,
    },
    itemUltimo: {
        borderBottomWidth: 0,
    },
    iconoWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1,
    },
    itemLabel: {
        flex: 1,
        fontSize: 16,
        fontFamily: Fonts.medium,
    },
    badge: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: Fonts.bold,
        color: Universitario.crema,
    },
    chevron: {
        opacity: 0.4,
    },
});
