import { Controller, useForm } from 'react-hook-form';
import Button from '../../UI-elements/button/Buttot';
import CustomCheckbox from '../../UI-elements/checkBox/CustomCheckBox';
import CustomDropdown from '../../UI-elements/dropdown/Dropdown';
import CustomInput from '../../UI-elements/input/Input';
import './Fields.css';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/sk';
import { useState } from 'react';
import Notification from '../notification/Notification';
import { createOrder } from '../API/API';
import { companiesMap, COMPANY_OPTIONS, COUNTRY_OPTIONS } from './companies';
import type { FormValues } from '../orders/types';
import { Link } from 'react-router-dom';
import Loader from '../../UI-elements/loader/Loader';

dayjs.extend(localizedFormat);
dayjs.locale('sk');

export const Fields = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [loader, setLoader] = useState(false);

  const defaultValues: FormValues = {
    productName: '',
    weight: '',
    company: '',
    street: '',
    psc: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    pickupType: '',
    pickupDate: '',
    contractNumber: '',
    services: [],
    gdpr: false,
    receiverName: '',
    receiverStreet: '',
    receiverPsc: '',
    receiverCity: '',
    receiverCountry: '',
    receiverPhone: '',
    receiverEmail: '',
    note: '',
  };

  const { handleSubmit, control, reset, watch } = useForm<FormValues>({
    defaultValues,
  });

  const pickupType = watch('pickupType');

  const onSubmit = async (data: FormValues) => {
    setLoader(true);

    if (honeypot.trim() !== '') {
      console.warn('Bot submission detected — honeypot triggered.');
      return;
    }

    try {
      const productsArray = data.productName
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const pickupDateFormatted =
        data.pickupType === 'asap'
          ? 'Čo najskôr'
          : dayjs(data.pickupDate).isValid()
            ? dayjs(data.pickupDate).toDate()
            : null;

      const payload = {
        company: data.company,
        street: data.street,
        psc: data.psc,
        city: data.city,
        country: data.country,
        email: data.email,
        phone: data.phone,
        pickupType: data.pickupType,
        pickupDate: pickupDateFormatted,
        services: data.services,
        gdpr: data.gdpr,
        deliveryNote: data.note,
        contractNumber: data.contractNumber,
        products: productsArray,
        weight: data.weight,
        // from
        fullname: data.receiverName,
        receiverStreet: data.receiverStreet,
        receiverPsc: data.receiverPsc,
        receiverCity: data.receiverCity,
        receiverCountry: data.receiverCountry,
        receiverPhone: data.receiverPhone,
        receiverEmail: data.receiverEmail,
        from: `${data.street}, ${data.city} ${data.psc}, ${data.country}`,
        to: `${data.receiverStreet}, ${data.receiverCity} ${data.receiverPsc}, ${data.receiverCountry}`,
      };

      await createOrder(payload);

      setNotification({ message: 'Formulár bol úspešne odoslaný!', type: 'success' });
      reset(defaultValues);
    } catch (error) {
      setNotification({ message: 'Chyba pri odosielaní formulára.', type: 'error' });
    } finally {
      setLoader(false);
    }
  };

  return (
    <section className="fields-section">
      {!notification && <h2 style={{ textAlign: 'center' }}>Objednávka dopravy</h2>}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {!notification && (
        <div className="fields-description">
          <div className="fields-container">
            <form className="fields-forms" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <h3 className="fields-forms-title">Odosielateľ</h3>
                <h4 className="fields-forms-title">Adresa vyzdvihnutia zásielky</h4>
              </div>

              <div style={{ display: 'none' }}>
                <label htmlFor="website">Ak ste človek, nechajte toto pole prázdne</label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Controller
                name="productName"
                control={control}
                rules={{
                  required: 'Toto pole je povinné',
                  validate: (value) => {
                    const products = value
                      .split(',')
                      .map((p) => p.trim())
                      .filter((p) => p.length > 0);

                    if (products.length === 0) {
                      return 'Musíte zadať aspoň jeden produkt';
                    }

                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Názov produktu (oddelte čiarkou)"
                    placeholder="Zadajte produkty oddelené čiarkou"
                    {...field}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="weight"
                rules={{
                  required: 'Toto pole je povinné',
                  validate: (value) =>
                    value.trim().length > 0 || 'Pole nemôže obsahovať iba medzery',
                }}
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Hmotnosť"
                    placeholder="Zadajte hmotnosť"
                    {...field}
                    type="number"
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="company"
                control={control}
                rules={{ required: 'Toto pole je povinné' }}
                render={({ field, fieldState }) => (
                  <CustomDropdown
                    label="Názov spoločnosti"
                    placeholder="Vyberte spoločnosť"
                    options={COMPANY_OPTIONS}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);

                      const companyData = companiesMap.find((c) => c.id === value);

                      reset({
                        ...watch(),
                        street: companyData?.adress || '',
                        psc: companyData?.psc || '',
                        city: companyData?.city || '',
                        country: companyData?.country || '',
                        email: companyData?.email || '',
                        phone: companyData?.phone || '',
                      });
                    }}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="street"
                rules={{
                  required: 'Toto pole je povinné',
                  validate: (value) =>
                    value.trim().length > 0 || 'Pole nemôže obsahovať iba medzery',
                }}
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Ulica a číslo domu"
                    placeholder="Zadajte ulicu a číslo domu"
                    {...field}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="psc"
                control={control}
                rules={{ required: 'Toto pole je povinné' }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="PSČ"
                    type="number"
                    placeholder="Zadajte PSČ"
                    {...field}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="city"
                control={control}
                rules={{
                  required: 'Toto pole je povinné',
                  validate: (value) =>
                    value.trim().length > 0 || 'Pole nemôže obsahovať iba medzery',
                }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Mesto"
                    type="text"
                    placeholder="Zadajte mesto"
                    {...field}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="country"
                control={control}
                rules={{ required: 'Toto pole je povinné' }}
                render={({ field, fieldState }) => (
                  <CustomDropdown
                    label="Krajina"
                    placeholder="Vyberte krajinu"
                    options={COUNTRY_OPTIONS}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="email"
                rules={{
                  required: 'Toto pole je povinné',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Zadajte platný email',
                  },
                  validate: (value) =>
                    value.trim().length > 0 || 'Pole nemôže obsahovať iba medzery',
                }}
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Email"
                    type="email"
                    placeholder="Zadajte email"
                    {...field}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="phone"
                rules={{
                  required: 'Toto pole je povinné',
                  validate: (value) => {
                    const phoneRegex = /^\+\d{8,15}$/;
                    return (
                      phoneRegex.test(value.trim()) ||
                      'Zadajte platné telefónne číslo vo formáte +421234567890'
                    );
                  },
                }}
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Kontaktný telefón"
                    type="text"
                    placeholder="+421900123456"
                    {...field}
                    onChange={(e) => {
                      let value = e.target.value;

                      if (!value.startsWith('+')) {
                        value = '+' + value.replace(/\D/g, '');
                      } else {
                        value = '+' + value.slice(1).replace(/\D/g, '');
                      }

                      if (value.length > 16) {
                        value = value.slice(0, 16);
                      }

                      field.onChange(value);
                    }}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <div>
                <h4 className="fields-forms-title">Kedy máme zásielku vyzdvihnúť?</h4>
                <Controller
                  name="pickupType"
                  control={control}
                  render={({ field }) => (
                    <>
                      <CustomCheckbox
                        label="Čo najskôr"
                        checked={field.value === 'asap'}
                        onChange={() => field.onChange('asap')}
                        error={false}
                        errorMessage="Musíte súhlasiť"
                      />
                      <CustomCheckbox
                        label="V konkrétny deň"
                        checked={field.value === 'date'}
                        onChange={() => field.onChange('date')}
                        error={false}
                        errorMessage="Musíte súhlasiť"
                      />
                    </>
                  )}
                />
              </div>

              {pickupType === 'date' && (
                <Controller
                  name="pickupDate"
                  control={control}
                  rules={{
                    validate: (value) => (value ? true : 'Musíte vybrať dátum a čas'),
                  }}
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Ak ste vybrali v konkrétny deň, vyberte dátum a čas"
                      type="datetime-local"
                      value={field.value ? dayjs(field.value).format('YYYY-MM-DDTHH:mm') : ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Vyberte dátum a čas"
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      min={dayjs().format('YYYY-MM-DDTHH:mm')}
                    />
                  )}
                />
              )}

              <Controller
                name="contractNumber"
                control={control}
                rules={{ required: 'Toto pole je povinné' }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Číslo DL (oddelte medzerou)"
                    type="text"
                    placeholder="Zadajte číslo DL"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9 ]/g, '');

                      field.onChange(value);
                    }}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <div>
                <h4 className="fields-forms-title">Vyberte službu</h4>
                <Controller
                  name="services"
                  control={control}
                  render={({ field }) => {
                    const toggle = (service: string) => {
                      if (field.value?.includes(service)) {
                        field.onChange(field.value.filter((s: string) => s !== service));
                      } else {
                        field.onChange([...(field.value || []), service]);
                      }
                    };
                    return (
                      <>
                        <CustomCheckbox
                          label="Inštalácia"
                          checked={field.value?.includes('Inštalácia')}
                          onChange={() => toggle('Inštalácia')}
                        />
                        <CustomCheckbox
                          label="Vynáška"
                          checked={field.value?.includes('Vynáška')}
                          onChange={() => toggle('Vynáška')}
                        />
                        <CustomCheckbox
                          label="Demontáž"
                          checked={field.value?.includes('Demontáž')}
                          onChange={() => toggle('Demontáž')}
                        />
                        <CustomCheckbox
                          label="Likvidácia"
                          checked={field.value?.includes('Likvidácia')}
                          onChange={() => toggle('Likvidácia')}
                        />
                      </>
                    );
                  }}
                />
              </div>
            </form>

            <form className="fields-forms">
              <div>
                <h3 className="fields-forms-title">Príjemca</h3>
                <h4 className="fields-forms-title">Adresa na doručenie zásielky</h4>
              </div>

              <Controller
                name="receiverName"
                control={control}
                rules={{
                  required: 'Toto pole je povinné',
                  validate: (value) =>
                    value.trim().length > 0 || 'Pole nemôže obsahovať iba medzery',
                }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Meno a priezvisko"
                    placeholder="Zadajte meno a priezvisko"
                    {...field}
                    type="text"
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="receiverStreet"
                control={control}
                rules={{
                  required: 'Toto pole je povinné',
                  validate: (value) =>
                    value.trim().length > 0 || 'Pole nemôže obsahovať iba medzery',
                }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Ulica a číslo domu"
                    placeholder="Zadajte ulicu a číslo domu"
                    {...field}
                    type="text"
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="receiverPsc"
                control={control}
                rules={{ required: 'Toto pole je povinné' }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="PSČ"
                    placeholder="Zadajte PSČ"
                    {...field}
                    type="number"
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="receiverCity"
                control={control}
                rules={{
                  required: 'Toto pole je povinné',
                  validate: (value) =>
                    value.trim().length > 0 || 'Pole nemôže obsahovať iba medzery',
                }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Mesto"
                    placeholder="Zadajte mesto"
                    {...field}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="receiverCountry"
                control={control}
                rules={{ required: 'Toto pole je povinné' }}
                render={({ field, fieldState }) => (
                  <CustomDropdown
                    label="Krajina"
                    placeholder="Vyberte krajinu"
                    options={COUNTRY_OPTIONS}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="receiverEmail"
                control={control}
                rules={{
                  required: 'Toto pole je povinné',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Zadajte platný email',
                  },
                }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Kontaktný email"
                    placeholder="Zadajte kontaktný email"
                    type="email"
                    {...field}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="receiverPhone"
                rules={{
                  required: 'Toto pole je povinné',
                  validate: (value) => {
                    const phoneRegex = /^\+\d{8,15}$/;

                    return (
                      phoneRegex.test(value.trim()) ||
                      'Zadajte platné telefónne číslo vo formáte +421234567890'
                    );
                  },
                }}
                control={control}
                render={({ field, fieldState }) => (
                  <CustomInput
                    label="Kontaktný telefón"
                    type="text"
                    placeholder="+421900123456"
                    {...field}
                    onChange={(e) => {
                      let value = e.target.value;

                      if (!value.startsWith('+')) {
                        value = '+' + value.replace(/\D/g, '');
                      } else {
                        value = '+' + value.slice(1).replace(/\D/g, '');
                      }

                      if (value.length > 16) {
                        value = value.slice(0, 16);
                      }

                      field.onChange(value);
                    }}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            </form>
          </div>

          <div className="fields-comment-section">
            <h4 className="fields-forms-title">Poznámka k objednávke</h4>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <textarea
                  className="fields-forms-comment"
                  placeholder="Poznámka k objednávke (voliteľné)"
                  rows={4}
                  {...field}
                />
              )}
            />
          </div>

          <div className="fields-gdpr-section">
            <h4 className="fields-forms-title">Súhlas so spracovaním osobných údajov</h4>

            <Controller
              name="gdpr"
              control={control}
              rules={{ required: 'Toto pole je povinné' }}
              render={({ field, fieldState }) => (
                <CustomCheckbox
                  label={
                    <>
                      Súhlasím so spracovaním osobných údajov za účelom kontaktovania s cenovou
                      ponukou na základe môjho dopytu, podľa{' '}
                      <Link to="/ochrana-osobnych-udajov" className="gdpr-link" target="_blank">
                        zásad ochrany osobných údajov
                      </Link>
                      .
                    </>
                  }
                  checked={field.value}
                  onChange={field.onChange}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="fields-buttons">
            <Button
              text="Očistiť formulár"
              variant="secondary"
              size="md"
              onClick={() => reset(defaultValues)}
              disabled={loader}
            />
            <Button
              text="Odoslať objednávku"
              variant="primary"
              size="md"
              onClick={handleSubmit(onSubmit)}
              disabled={loader}
            />
          </div>
        </div>
      )}

      {loader && <Loader fullscreen={true} />}
    </section>
  );
};
