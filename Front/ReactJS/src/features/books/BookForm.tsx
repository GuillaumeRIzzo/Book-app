import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Box } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import styled from 'styled-components';

import { AppDispatch, RootState } from '@redux/store';
import { Book } from '@/models/book/Book';

import Input from '@/components/common/Input';
import CustomButton from '@/components/common/Button';
import { createBook, updateBookAsync } from './bookSlice';
import { fetchAuthorsAsync } from '../authors/AuthorSlice';
import { fetchPublishersAsync } from '../publishers/PublisherSlice';
import { fetchCategoriesAsync } from '../categories/categorySlice';
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const StyledInput = styled(Input)`
  margin-bottom: 3rem;
`;

const BookForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;

  const book = useSelector((state: RootState) =>
    state.books.books.find((b: Book) => b.bookId === Number(id)),
  );

  // const Categories = useSelector(
  //   (state: RootState) => state.categories.categories,
  // );
  const categosStatus = useSelector(
    (state: RootState) => state.categories.status,
  );
  // const authors = useSelector((state: RootState) => state.authors.authors);
  const authorsStatus = useSelector((state: RootState) => state.authors.status);
  // const publishers = useSelector(
  //   (state: RootState) => state.publishers.publishers,
  // );
  const publishersStatus = useSelector(
    (state: RootState) => state.publishers.status,
  );

  useEffect(() => {
    if (categosStatus === 'idle') {
      dispatch(fetchCategoriesAsync());
    }
    if (authorsStatus === 'idle') {
      dispatch(fetchAuthorsAsync());
    }
    if (publishersStatus === 'idle') {
      dispatch(fetchPublishersAsync());
    }
  }, [categosStatus, authorsStatus, publishersStatus, dispatch]);

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    'Informations',
    'Auteurs, éditeurs et catégories',
    'Récapitulatif',
  ];

  const [formData, setFormData] = useState({
    BookId: book?.bookId || 0,
    BookUuid: book?.bookUuid || '',
    BookTitle: book?.bookTitle || '',
    BookDescription: book?.bookDescription || ''/* ,
    BookPublishDate: book?.bookPublishDate || new Date(),
    BookPageCount: book?.bookPageCount || 0, */
  });

  // const isValidImageUrl = imageUrlRegex.test(formData.BookImageLink.trim());

  const [touched, setTouched] = useState({
    BookTitle: false,
    BookDescription: false
    // BookPublishDate: false,
    // BookPageCount: false,
    // BookImageLink: false,
    // BookLanguage: false,
    // PublisherId: false,
    // AuthorId: false,
    // Categories: false,
  });

  const handleNext = (event?: React.FormEvent<HTMLFormElement>) => {
    // Prevent form submission if the button is within the form
    if (event) event.preventDefault(); 
    const errors = getStepErrors();
    if (errors.has(activeStep)) {
      return;
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const getStepErrors = () => {
    const errors = new Set<number>();

    // Step 0: Basic informations
    if (
      !formData.BookTitle.trim() ||
      !formData.BookDescription.trim()/*  ||
      !formData.BookPublishDate ||
      formData.BookPageCount < 1  *//* ||
      !isValidImageUrl ||
      !formData.BookLanguage.trim() */
    ) {
      errors.add(0);
    }

    // Step 1: Author, publisher, Categories
    // if (
    //   !formData.AuthorId ||
    //   !formData.PublisherId ||
    //   formData.Categories.length < 1
    // ) {
    //   errors.add(1);
    // }

    return errors;
  };

  const stepErrors = getStepErrors();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number | Date = value;

    if (type === 'number') {
      parsedValue = parseInt(value, 10) || 0;
    }

    if (type === 'date') {
      parsedValue = value ? new Date(value) : new Date();
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent page reload
    event.preventDefault(); 
    try {
      const encryptedPayload: EncryptedPayload = encryptPayload(
        formData as Record<string, unknown>,
      );

      if (formData.BookId === 0) {
        dispatch(createBook(encryptedPayload)).unwrap();
        router.push('/');
      } else {
        dispatch(
          updateBookAsync({
            bookUuid: formData.BookUuid,
            payload: encryptedPayload,
          }),
        ).unwrap();
        router.push(`/book/${formData.BookId}`);
      }
    } catch (error) {}
  };

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.getElementById('app-header');
    if (!header) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setHeaderHeight(entry.contentRect.height);
      }
    });

    // if (
    //   formData.BookPublishDate &&
    //   typeof formData.BookPublishDate === 'string'
    // ) {
    //   setFormData(prev => ({
    //     ...prev,
    //     BookPublishDate: new Date(prev.BookPublishDate),
    //   }));
    // }

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  return (
    <Box px='4rem' display='flex' flexDirection='column'>
      <Box
        component='form'
        onSubmit={handleSubmit}
        pt={2}
        height={`calc(100vh - ${headerHeight}px - 24px)`}
      >
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel error={stepErrors.has(index)}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Fragment>
          <Box display='flex' flexGrow={1} height={'100%'}>
            <Box
              width='100px'
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <CustomButton
                className='h-12 mr-1'
                disabled={activeStep === 0}
                onClick={handleBack}
                text='Précédent'
                icon={<ArrowLeftIcon className='w-5 h-5' />}
              />
            </Box>
            <Box sx={{ flex: '1 1 auto' }} />
            <Box
              mt={3}
              flex={1}
              display='flex'
              alignItems='stretch'
              flexDirection={'column'}
            >
              {activeStep === 0 && (
                <Fragment>
                  <StyledInput
                    required
                    label='Titre du livre'
                    name='BookTitle'
                    value={formData.BookTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.BookTitle && !formData.BookTitle}
                  />
                  <StyledInput
                    required
                    label='Description'
                    name='BookDescription'
                    value={formData.BookDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.BookDescription && !formData.BookDescription}
                  />
                  {/* <StyledInput
                    required
                    type='date'
                    label='Date de publication'
                    name='BookPublishDate'
                    value={
                      formData.BookPublishDate
                        ? new Date(formData.BookPublishDate)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.BookPublishDate && !formData.BookPublishDate}
                  />
                  <StyledInput
                    required
                    type='number'
                    label='Nombre de page'
                    name='BookPageCount'
                    value={formData.BookPageCount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.BookPageCount && !formData.BookPageCount}
                  /> */}
                  {/* <StyledInput
                    label="Lien de l'image"
                    type='url'
                    name='BookImageLink'
                    value={formData.BookImageLink}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.BookImageLink && !isValidImageUrl}
                    required
                  /> */}
                  {/* <StyledInput
                    required
                    label='Langue'
                    name='BookLanguage'
                    value={formData.BookLanguage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.BookLanguage && !formData.BookLanguage}
                  /> */}
                </Fragment>
              )}

              {activeStep === 1 && (
                <Fragment>
                  {/* <Autocomplete
                    className='mb-12'
                    options={authors}
                    getOptionLabel={option => option.authorFullName}
                    isOptionEqualToValue={(option, value) =>
                      option.authorId === value.authorId
                    }
                    value={
                      authors.find(
                        author => author.authorId === formData.AuthorId,
                      ) || null
                    }
                    onChange={(event, value) => {
                      setFormData(prev => ({
                        ...prev,
                        AuthorId: value?.authorId || 0,
                      }));
                    }}
                    renderInput={params => (
                      <Input
                        {...params}
                        label='Auteur'
                        name='AuthorId'
                        error={touched.AuthorId && !formData.AuthorId}
                        required
                      />
                    )}
                    onBlur={handleBlur}
                  />

                  <Autocomplete
                    className='mb-12'
                    options={publishers}
                    getOptionLabel={option => option.publisherName}
                    isOptionEqualToValue={(option, value) =>
                      option.publisherId === value.publisherId
                    }
                    value={
                      publishers.find(
                        pub => pub.publisherId === formData.PublisherId,
                      ) || null
                    }
                    onChange={(event, value) => {
                      setFormData(prev => ({
                        ...prev,
                        PublisherId: value?.publisherId || 0,
                      }));
                    }}
                    renderInput={params => (
                      <Input
                        {...params}
                        label='Éditeur'
                        name='PublisherId'
                        error={touched.PublisherId && !formData.PublisherId}
                        required
                      />
                    )}
                    onBlur={handleBlur}
                  />

                  <Autocomplete
                    multiple
                    options={Categories}
                    getOptionLabel={option => option.categoryName}
                    value={formData.Categories}
                    onChange={(event, value) => {
                      setFormData(prev => ({ ...prev, Categories: value }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.categoryId === value.categoryId
                    }
                    renderInput={params => (
                      <Input
                        {...params}
                        label='Catégories'
                        name='Categories'
                        error={touched.Categories && !formData.Categories}
                        required
                      />
                    )}
                    onBlur={handleBlur}
                  /> */}
                </Fragment>
              )}

              {activeStep === 2 && (
                <Fragment>
                  <p>
                    <strong>Titre :</strong> {formData.BookTitle}
                  </p>
                  <p>
                    <strong>Description :</strong> {formData.BookDescription}
                  </p>
                  {/* <p>
                    <strong>Date de publication :</strong>{' '}
                    {new Date(formData.BookPublishDate).toLocaleDateString(
                      'fr-FR',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      },
                    )}
                  </p>
                  <p>
                    <strong>Nombre de pages :</strong> {formData.BookPageCount}
                  </p> */}
                  {/* <p>
                    <strong>Langue :</strong> {formData.BookLanguage}
                  </p>
                  <p>
                    <strong>Lien image :</strong>{' '}
                  </p>

                  <p>
                    <strong>Auteur :</strong>{' '}
                    {authors.find(a => a.authorId === formData.AuthorId)
                      ?.authorFullName || 'Non défini'}
                  </p>
                  <p>
                    <strong>Éditeur :</strong>{' '}
                    {publishers.find(
                      p => p.publisherId === formData.PublisherId,
                    )?.publisherName || 'Non défini'}
                  </p>
                  <p>
                    <strong>Catégories :</strong>{' '}
                    {formData.Categories.length > 0
                      ? formData.Categories.map(c => c.categoryName).join(
                          ', ',
                        )
                      : 'Aucune'}
                  </p> */}
                </Fragment>
              )}
            </Box>

            <Box sx={{ flex: '1 1 auto' }} />
            <Box
              width='100px'
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              {activeStep === steps.length - 1 ? (
                <CustomButton className='h-12' type='submit' text='Soumettre' />
              ) : (
                <CustomButton
                  className='h-12'
                  type='button'
                  onClick={e => {
                    e.preventDefault();
                    handleNext();
                  }}
                  text='Suivant'
                  disable={stepErrors.has(activeStep)}
                  icon={<ArrowRightIcon className='w-5 h-5' />}
                  iconPosition='right'
                />
              )}
            </Box>
          </Box>
        </Fragment>
      </Box>
    </Box>
  );
};

export default BookForm;
