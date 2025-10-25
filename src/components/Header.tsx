import HeaderUserDropdown from './HeaderUserDropdown'

function Header() {
  return (
    <header className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">PexKit</h1>
        <HeaderUserDropdown />
      </div>
    </header>
  )
}

export default Header
