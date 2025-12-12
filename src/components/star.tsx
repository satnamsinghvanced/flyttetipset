import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarProps {
    averageRating: number;
    totalRating: number;
}

const Star = ({ averageRating, totalRating }: StarProps) => {
    const MAX_STARS = 5;
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.25 && averageRating % 1 < 0.75;
    const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }

    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" />);
    }

    return (
        <div className="flex items-center space-x-2 pt-1">
            <div className="flex space-x-1">
                {stars}
            </div>
            <p className="text-sm">
                <span className="text-primary">
                    {averageRating && averageRating.toFixed(1)}
                </span>
                {" "}
                <span className="text-secondary">
                    ({totalRating})
                </span>
            </p>
        </div>
    );
};

export default Star;
