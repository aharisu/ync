type Props = {
  text: string;
  href: string;
};

export const Item = ({ text, href }: Props) => {
  return (
    <li>
      <a href={href}>{text}</a>
    </li>
  );
};
