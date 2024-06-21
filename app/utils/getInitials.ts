const getInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    if (initials.length > 1) {
        return `${initials[0]}${initials[initials.length - 1]}`;
    } else {
        return initials[0];
    }
};

export default getInitials;
