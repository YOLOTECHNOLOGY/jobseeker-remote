/* Components */
import PublicHeader from './PublicHeader'
// import ProtectedHeader from './ProtectedHeader'

const Header = () => {
  return (
    <div>
      <PublicHeader />
      {/* <ProtectedHeader /> */}
    </div>
  )
}

export default Header