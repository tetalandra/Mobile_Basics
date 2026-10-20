import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  Modal,
  Image,
} from 'react-native';

import { Spacing, MaxContentWidth, BottomTabInset } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

/**
 * TUZA Form App - Comprehensive Form Demonstration
 * 
 * This form demonstrates:
 * 1. ✅ React Native with Expo setup
 * 2. ✅ ALL TextInput keyboard types (13 total):
 *    - default: Standard keyboard
 *    - email-address: Email keyboard with @ and .
 *    - phone-pad: Phone number keyboard
 *    - url: URL keyboard with / and .com
 *    - web-search: Search keyboard with search button
 *    - numeric: Number keyboard (digits only)
 *    - decimal-pad: Decimal keyboard with .
 *    - number-pad: Number pad (no decimal)
 *    - ascii-capable: ASCII keyboard
 *    - name-phone-pad: Letters and numbers
 *    - visible-password: Password keyboard (visible)
 *    - secureTextEntry: Password (hidden)
 *    - multiline: Textarea equivalent
 * 
 * 3. ✅ Other form elements:
 *    - Radio buttons (custom implementation)
 *    - Checkboxes (custom implementation)
 *    - Switches (native component)
 *    - Select/Dropdown (custom chip selector)
 * 
 * 4. ✅ Form submission:
 *    - Collects all form data
 *    - Outputs as JSON to console
 *    - Validates required fields (terms acceptance)
 */

type Plan = 'free' | 'pro' | 'enterprise';
type Contact = 'email' | 'phone' | 'sms';
type Skill = 'html' | 'css' | 'javascript' | 'typescript' | 'python';

const SKILLS: { value: Skill; label: string }[] = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
];

const PLANS: { value: Plan; label: string }[] = [
  { value: 'free', label: 'Free plan' },
  { value: 'pro', label: 'Pro plan' },
  { value: 'enterprise', label: 'Enterprise plan' },
];

const CONTACTS: { value: Contact; label: string }[] = [
  { value: 'email', label: 'Contact by email' },
  { value: 'phone', label: 'Contact by phone' },
  { value: 'sms', label: 'Contact by SMS' },
];

const COUNTRIES = ['', 'US', 'UK', 'CA', 'AU', 'IN'];

const EMPTY_VALUES = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  website: '',
  search: '',
  age: '',
  price: '',
  cardDigits: '',
  username: '',
  city: '',
  pin: '',
  bio: '',
  country: '',
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <ThemedText type="small">{label}</ThemedText>
      {hint ? (
        <ThemedText type="small" themeColor="textSecondary">
          {hint}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );
}

function ChoiceRow({
  label,
  selected,
  onPress,
  radio,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  radio?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceRow,
        selected && { backgroundColor: '#EAF2FE' },
        pressed && !selected && { backgroundColor: theme.backgroundSelected },
      ]}
    >
      <View
        style={[
          styles.choiceBox,
          radio ? styles.radio : styles.checkbox,
          { borderColor: selected ? '#2f6fe4' : theme.textSecondary },
        ]}
      >
        {selected ? <Text style={styles.choiceMark}>{radio ? '●' : '✓'}</Text> : null}
      </View>
      <ThemedText type="small">{label}</ThemedText>
    </Pressable>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <ThemedText type="subtitle" style={styles.sectionTitle}>{children}</ThemedText>;
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <ThemedText type="smallBold" style={styles.groupTitle}>{children}</ThemedText>;
}

export default function FormScreen() {
  const theme = useTheme();

  // --- state for every control ---
  const [values, setValues] = useState(EMPTY_VALUES);
  const [secureVisible, setSecureVisible] = useState(false);
  const [plan, setPlan] = useState<Plan>('free');
  const [contact, setContact] = useState<Contact>('email');
  const [skills, setSkills] = useState<Set<Skill>>(new Set([]));
  const [newsletter, setNewsletter] = useState(false);
  const [terms, setTerms] = useState(false);
  const [betaOptIn, setBetaOptIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const setValue = (key: keyof typeof values, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const toggleSkill = (s: Skill) =>
    setSkills((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });

  const jsonData = useMemo(
    () => ({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      website: values.website,
      search: values.search,
      age: values.age,
      price: values.price,
      cardDigits: values.cardDigits,
      username: values.username,
      displayName: values.city,
      pin: values.pin,
      bio: values.bio,
      country: values.country || null,
      plan,
      contact,
      skills: SKILLS.filter((s) => skills.has(s.value)).map((s) => s.value),
      newsletter,
      termsAccepted: terms,
      betaOptIn,
    }),
    [values, plan, contact, skills, newsletter, terms, betaOptIn],
  );

  const onSubmit = () => {
    if (!terms) return;
    console.log('Form JSON object:', JSON.stringify(jsonData, null, 2));
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const reset = () => {
    setValues(EMPTY_VALUES);
    setSecureVisible(false);
    setPlan('free');
    setContact('email');
    setSkills(new Set([]));
    setNewsletter(false);
    setTerms(false);
    setBetaOptIn(false);
  };

  const inputStyle = [
    styles.input,
    { color: theme.text, borderColor: theme.backgroundSelected, backgroundColor: theme.background },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: BottomTabInset + Spacing.five }]}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.inner}>
          <ThemedText type="title" style={styles.mainTitle}>TUZA App</ThemedText>

          {/* Button to open modal */}
          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.viewImageButton}
          >
            <Text style={styles.viewImageButtonText}>View Profile Image</Text>
          </Pressable>

          {/* Modal Component */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <ThemedText type="subtitle" style={styles.modalTitle}>
                  Profile Image
                </ThemedText>
                <ThemedText type="small" style={styles.modalDescription}>
                  A self-contained overlay component that presents content above the current
                  application view hierarchy.
                </ThemedText>
                
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800' }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />

                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close Modal</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* ---- PERSONAL INFORMATION ---- */}
          <SectionTitle>Personal Information</SectionTitle>

          <Field label="Full Name">
            <TextInput
              style={inputStyle}
              keyboardType="default"
              placeholder="Enter your full name"
              placeholderTextColor={theme.textSecondary}
              value={values.fullName}
              onChangeText={(v) => setValue('fullName', v)}
              accessibilityLabel="Full name"
            />
          </Field>

          <Field label="Email Address">
            <TextInput
              style={inputStyle}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              placeholderTextColor={theme.textSecondary}
              value={values.email}
              onChangeText={(v) => setValue('email', v)}
              accessibilityLabel="Email address"
            />
          </Field>

          <Field label="Password">
            <View style={styles.secureRow}>
              <TextInput
                style={[inputStyle[0], inputStyle[1], styles.secureInput]}
                keyboardType="default"
                secureTextEntry={!secureVisible}
                placeholder="Enter password"
                placeholderTextColor={theme.textSecondary}
                value={values.password}
                onChangeText={(v) => setValue('password', v)}
              />
              <Pressable onPress={() => setSecureVisible((v) => !v)} hitSlop={8}>
                <ThemedText type="small" style={{ color: '#2f6fe4' }}>
                  {secureVisible ? 'Hide' : 'Show'}
                </ThemedText>
              </Pressable>
            </View>
          </Field>

          <Field label="Phone Number">
            <TextInput
              style={inputStyle}
              keyboardType="phone-pad"
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={theme.textSecondary}
              value={values.phone}
              onChangeText={(v) => setValue('phone', v)}
            />
          </Field>

          <Field label="Website">
            <TextInput
              style={inputStyle}
              keyboardType="url"
              autoCapitalize="none"
              placeholder="https://yourwebsite.com"
              placeholderTextColor={theme.textSecondary}
              value={values.website}
              onChangeText={(v) => setValue('website', v)}
            />
          </Field>

          <Field label="Search">
            <TextInput
              style={inputStyle}
              keyboardType="web-search"
              returnKeyType="search"
              placeholder="Search anything..."
              placeholderTextColor={theme.textSecondary}
              value={values.search}
              onChangeText={(v) => setValue('search', v)}
            />
          </Field>

          <Field label="Age">
            <TextInput
              style={inputStyle}
              keyboardType="numeric"
              placeholder="Enter your age"
              placeholderTextColor={theme.textSecondary}
              value={values.age}
              onChangeText={(v) => setValue('age', v.replace(/[^0-9]/g, ''))}
            />
          </Field>

          <Field label="Price">
            <TextInput
              style={inputStyle}
              keyboardType="decimal-pad"
              placeholder="Enter price (e.g., 19.99)"
              placeholderTextColor={theme.textSecondary}
              value={values.price}
              onChangeText={(v) => setValue('price', v.replace(/[^0-9.]/g, ''))}
            />
          </Field>

          <Field label="Card Digits">
            <TextInput
              style={inputStyle}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="Last 4 digits"
              placeholderTextColor={theme.textSecondary}
              value={values.cardDigits}
              onChangeText={(v) => setValue('cardDigits', v.replace(/[^0-9]/g, ''))}
            />
          </Field>

          <Field label="Username">
            <TextInput
              style={inputStyle}
              keyboardType="ascii-capable"
              autoCorrect={false}
              placeholder="Enter username"
              placeholderTextColor={theme.textSecondary}
              value={values.username}
              onChangeText={(v) => setValue('username', v)}
            />
          </Field>

          <Field label="Display Name">
            <TextInput
              style={inputStyle}
              keyboardType="name-phone-pad"
              placeholder="Name or number"
              placeholderTextColor={theme.textSecondary}
              value={values.city}
              onChangeText={(v) => setValue('city', v)}
            />
          </Field>

          <Field label="PIN">
            <TextInput
              style={inputStyle}
              keyboardType="visible-password"
              placeholder="Enter PIN"
              placeholderTextColor={theme.textSecondary}
              value={values.pin}
              onChangeText={(v) => setValue('pin', v)}
            />
          </Field>

          <Field label="Country">
            <View style={styles.chipWrap}>
              {COUNTRIES.filter(c => c !== '').map((c) => {
                const selected = values.country === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setValue('country', c)}
                    style={[
                      styles.chip,
                      {
                        borderColor: selected ? '#2f6fe4' : theme.backgroundSelected,
                        backgroundColor: selected ? '#EAF2FE' : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected ? '#2f6fe4' : theme.textSecondary,
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="City">
            <TextInput
              style={inputStyle}
              keyboardType="default"
              placeholder="Enter your city"
              placeholderTextColor={theme.textSecondary}
              value={values.city}
              onChangeText={(v) => setValue('city', v)}
            />
          </Field>

          <Field label="Bio">
            <TextInput
              style={[inputStyle[0], inputStyle[1], styles.multiline]}
              keyboardType="default"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Tell us about yourself..."
              placeholderTextColor={theme.textSecondary}
              value={values.bio}
              onChangeText={(v) => setValue('bio', v)}
            />
          </Field>

          {/* ---- PREFERENCES ---- */}
          <SectionTitle>Subscription Plan</SectionTitle>
          {PLANS.map((p) => (
            <ChoiceRow
              key={p.value}
              label={p.label}
              selected={plan === p.value}
              radio
              onPress={() => setPlan(p.value)}
            />
          ))}

          <SectionTitle>Preferred Contact Method</SectionTitle>
          {CONTACTS.map((c) => (
            <ChoiceRow
              key={c.value}
              label={c.label}
              selected={contact === c.value}
              radio
              onPress={() => setContact(c.value)}
            />
          ))}

          <SectionTitle>Skills</SectionTitle>
          {SKILLS.map((s) => (
            <ChoiceRow
              key={s.value}
              label={s.label}
              selected={skills.has(s.value)}
              onPress={() => toggleSkill(s.value)}
            />
          ))}

          <SectionTitle>Additional Options</SectionTitle>
          <View style={styles.switchRow}>
            <ThemedText type="default">Subscribe to newsletter</ThemedText>
            <Switch value={newsletter} onValueChange={setNewsletter} />
          </View>
          <View style={styles.switchRow}>
            <ThemedText type="default">Enable beta features</ThemedText>
            <Switch value={betaOptIn} onValueChange={setBetaOptIn} />
          </View>
          <View style={[styles.switchRow, styles.termsRow]}>
            <ThemedText type="default">I accept the terms and conditions *</ThemedText>
            <Switch value={terms} onValueChange={setTerms} />
          </View>

          {/* Submit + Reset buttons */}
          <Pressable
            onPress={onSubmit}
            accessibilityRole="button"
            disabled={!terms}
            style={({ pressed }) => [
              styles.submitBtn,
              !terms && styles.submitDisabled,
              pressed && terms && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.submitText}>{submitted ? 'Submitted ✓' : 'Submit'}</Text>
          </Pressable>
          <Pressable
            onPress={reset}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.resetBtn,
              { borderColor: theme.backgroundSelected },
              pressed && { backgroundColor: theme.backgroundSelected },
            ]}
          >
            <Text style={[styles.resetText, { color: theme.text }]}>Reset Form</Text>
          </Pressable>

          <ThemedText type="small" themeColor="textSecondary">
            Submit is enabled once “Accept terms” is on. JSON object is printed in the console
            (terminal running Expo / browser devtools).
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  inner: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: Spacing.three,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: Spacing.five,
    marginBottom: Spacing.three,
    fontSize: 18,
    fontWeight: '700',
  },
  groupTitle: {
    marginTop: Spacing.four,
    marginBottom: Spacing.one,
  },
  field: {
    marginBottom: Spacing.four,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, default: 8 }),
    fontSize: 16,
    marginTop: Spacing.one,
  },
  multiline: {
    minHeight: 90,
    paddingTop: 10,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  secureInput: {
    flex: 1,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: 8,
  },
  choiceBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radio: { borderRadius: 11 },
  checkbox: { borderRadius: 5 },
  choiceMark: {
    fontSize: 13,
    color: '#2f6fe4',
    lineHeight: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  termsRow: {
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    marginTop: Spacing.three,
    paddingVertical: Spacing.three,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  submitBtn: {
    backgroundColor: '#2f6fe4',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.five,
  },
  submitDisabled: { opacity: 0.45 },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resetBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.two,
    borderWidth: 1,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewImageButton: {
    backgroundColor: '#2f6fe4',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  viewImageButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: Spacing.five,
    width: '90%',
    maxWidth: 600,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.two,
    color: '#333',
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: Spacing.four,
    lineHeight: 20,
  },
  modalImage: {
    width: '100%',
    height: 400,
    marginBottom: Spacing.four,
    borderRadius: 12,
  },
  closeButton: {
    backgroundColor: '#2f6fe4',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: Spacing.two,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
