const SidebarItems = ({ icon, label, onClick, isOpen }) => {
  return (
    <div
      className="flex items-center p-3 mb-2 text-(--color-text-muted) hover:bg-(--color-primary-soft) hover:text-(--color-primary) rounded cursor-pointer"
      onClick={onClick}
    >
      <div className="mr-3 text-lg">{icon}</div>
      {isOpen && <div className="text-sm">{label}</div>}
    </div>
  );
};
export default SidebarItems;