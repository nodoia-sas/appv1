// Redirect legacy /profile to the auth-aware profile page
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/auth/profile',
      permanent: false,
    },
  }
}

export default function ProfileRedirect() {
  // Fallback UI in case redirect doesn't run on client
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Redirigiendo al perfil...</h1>
      <p className="text-gray-600">Si no eres redirigido automáticamente, pulsa <a href="/auth/profile" className="text-blue-600">aquí</a>.</p>
    </div>
  )
}
