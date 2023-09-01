type LayoutProps = {
  children: React.ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return <div className="grid h-screen place-items-center">{children}</div>;
};

export default Layout;
