export default function Map() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3146.0399491793164!2d-122.03358!3d37.97743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085613d0ea6a0c5%3A0x3f5ca6a6e501ec97!2s2190%20Solano%20Way%2C%20Concord%2C%20CA%2094520!5e0!3m2!1sen!2sus!4v1706419000000!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}