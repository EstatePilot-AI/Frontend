const SidebarItems = ({ icon, label, onClick, isOpen }) => {
  return (
    <div
      className="flex items-center p-3 mb-2 text-[#4A5565] hover:bg-[#EEF2FF] hover:text-[#4F39F6] rounded cursor-pointer"
      onClick={onClick}
    >
      <div className="mr-3 text-lg">{icon}</div>
      {isOpen && <div className="text-sm">{label}</div>}
    </div>
  );
};
export default SidebarItems;