import dynamic from 'next/dynamic';
const SideBar = dynamic(() => import('@/components/sidebar'), { ssr: false });

const Terms = () => {
  return (
    <>
      <div className='absolute top-0'>
        <SideBar />
      </div>
      <div className='mx-auto max-w-3xl px-4 py-20'>
        <h1 className='mb-4 text-4xl font-bold'>TERMS OF SERVICE</h1>
        <h1 className='mb-4 text-xl'>Last updated: 05/06/2024</h1>
        <p className='mb-4'>
          <strong className='font-bold'>Acceptance of Terms:</strong> By using
          Elyzen, you agree to these Terms of Service and acknowledge that they
          affect your legal rights and obligations.
        </p>
        <p className='mb-4'>
          <strong className='font-bold'>Content:</strong> Elyzen does not host
          video content but embeds videos from various third-party sources. We
          are not responsible for the content, quality, or the policies of these
          external sites.
        </p>
        <p className='mb-4'>
          <strong className='font-bold'>Use of Site:</strong> The service is
          provided &quot;as is&quot; and is used at the user&apos;s own risk.
          Users must not misuse the service in any way that breaches laws or
          regulations.
        </p>
        <p className='mb-4'>
          <strong className='font-bold'>User Content:</strong> Users may share
          content, such as comments or reviews, responsibly. We reserve the
          right to remove any content that violates our policies or is deemed
          inappropriate.
        </p>
        <p className='mb-4'>
          <strong className='font-bold'>Intellectual Property:</strong> The
          intellectual property rights of the embedded videos remain with their
          respective owners. Elyzen respects these rights and does not claim
          ownership of this content.
        </p>
        <p className='mb-8'>
          <strong className='font-bold'>Changes to Terms of Service:</strong> We
          reserve the right to modify these terms at any time. Continued use of
          the site after changes constitutes acceptance of the new terms.
        </p>
        <p>
          <strong className='font-bold'>Termination:</strong> We may terminate
          or suspend access to our service immediately, without prior notice,
          for any breach of these Terms.
        </p>
      </div>
    </>
  );
};

export default Terms;
