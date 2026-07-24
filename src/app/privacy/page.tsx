import dynamic from 'next/dynamic';
const SideBar = dynamic(() => import('@/components/sidebar'), { ssr: false });

const PrivacyPolicy = () => {
  return (
    <>
      <div className='absolute top-0'>
        <SideBar />
      </div>
      <div className='mx-auto max-w-3xl px-4 py-20'>
        <h1 className='mb-4 text-4xl font-bold'>PRIVACY POLICY</h1>
        <h1 className='mb-4 text-xl'>Last updated: 05/06/2024</h1>
        <p className='mb-4 text-lg'>
          At Elyzen, we take your privacy seriously. We are committed to
          protecting the privacy of our users and ensuring that all personal
          information provided to us remains confidential.
        </p>
        <p className='mb-4 text-lg'>
          Elyzen does not collect any personal information from its users. We do
          not use cookies or any other tracking technologies. We only store a
          few settings locally when the app is accessed from localhost. You can
          remove your local storage data by clearing your browser site cache or
          removing local storage values.
        </p>
        <p className='mb-4 text-lg'>
          Our app is designed to respect your privacy and anonymity. You can use
          Elyzen with the assurance that your personal information will never be
          compromised.
        </p>
        <p className='mb-12 text-lg'>
          If you have any questions or concerns about our privacy policy, please
          feel free to contact us at privacy@Elyzen.com.
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
